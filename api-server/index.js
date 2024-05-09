const express = require('express')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
const { Server } = require('socket.io')
const Redis = require('ioredis')

const { PrismaClient } = require('@prisma/client')
const cors = require('cors')
require('dotenv').config();



const app = express()
const PORT = 9000

app.use(cors())

const prisma = new PrismaClient()

const redisUri = process.env.redisUri
const subscriber = new Redis(redisUri)

const io = new Server({ cors: '*' })

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

io.listen(9002, () => console.log('Socket Server 9002'))

const ecsClient = new ECSClient({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    }
})



const config = {
    CLUSTER: 'arn:aws:ecs:us-east-1:905418048777:cluster/builder-cluster',
    TASK: 'arn:aws:ecs:us-east-1:905418048777:task-definition/builder-task'
}

app.use(express.json())


app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ message: "fields are empty" });
            return;
        }
        const isEmailExists = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        const isUsernameExists = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        if (isEmailExists || isUsernameExists) {
            res
                .status(400)
                .json({ message: "user with email or username already exits" });
            return;
        }

        const user = await prisma.user.create({
            data: req.body,
        });

        if (user) {
            res.status(200).json({ message: "user crearted", id: user.id });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "fields are empty" });
            return;
        }
        const isEmailExists = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!isEmailExists) {
            res
                .status(400)
                .json({ message: "user with email not registered" });
            return;
        }

        if (isEmailExists.password !== password) {
            res.status(402).json({
                error: "password is incorrent"
            })

        }

        res.json({
            message: 'valid user',
            user: isEmailExists
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/getprojects', async (req, res) => {
    const userId = req.body.id;
    try {
        const getProject = await prisma.project.findMany({
            where: {
                authorId: Number(userId)
            }
        })
        if (getProject.length === 0) throw new Error("No Project has been found")
        res.json({
            project: getProject
        })
    } catch (error) {
        console.log(error.message);
        res.status(401).json({
            error: error.message
        })
    }

})

app.post("/updatepassword", async (req, res) => {
    const { userId, currentpass, newpassword } = req.body;
    try {
        const getUser = await prisma.user.findFirst({
            where: {
                id: Number(userId)
            }
        })
        if (getUser.password !== String(currentpass)) throw new Error("Current password does not matches")

        const updatedPass = await prisma.user.update({
            where: {
                id: Number(userId)
            },
            data: {
                password: newpassword
            }
        })
        if (!updatedPass) throw new Error("Problem with updating")
        res.json({
            message: 'success'
        })

    } catch (error) {
        console.log(error.message);
        res.status(401).send({
            error: error.message
        })
    }
})


app.post("/updateinfo", async (req, res) => {
    // send in body userId, username, email, bio
    const { userId, username, bio, email } = req.body;
    try {
        const getUser = await prisma.user.findFirst({
            where: {
                id: Number(userId)
            }
        })
        if (!getUser) throw new Error("Current user not matches")

        const updatedinfo = await prisma.user.update({
            where: {
                id: Number(userId)
            },
            data: {
                username: username,
                email: email,

            }
        })
        if (!updatedinfo) throw new Error("Problem with updating")
        res.json({
            message: 'success',
            info: updatedinfo
        })

    } catch (error) {
        console.log(error.message);
        res.status(401).send({
            error: error.message
        })
    }
})

app.post('/project', async (req, res) => {
    const { gitURL, slug, userId } = req.body
    if (!gitURL || !userId) {
        res.status(401).json({
            error: 'you might have missed url or userID'
        })
        return;
    }
    try {
        const isUsernameExists = await prisma.user.findFirst({
            where: {
                id: Number(userId)
            }
        })
        if (!isUsernameExists) {
            throw new Error('Invalid user')
            return
        }
        const projectSlug = slug ? slug : generateSlug()

        // Spin the container
        const command = new RunTaskCommand({
            cluster: config.CLUSTER,
            taskDefinition: config.TASK,
            launchType: 'FARGATE',
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: 'ENABLED',
                    subnets: ['subnet-01f49442c9eea855f', 'subnet-013f57a7014c478e9', 'subnet-06fa832bdf59fa2b4'],
                    securityGroups: ['sg-03da0fae6fee63816']
                }
            },
            overrides: {
                containerOverrides: [
                    {
                        name: 'builder-image',
                        environment: [
                            { name: 'GIT_REPOSITORY__URL', value: gitURL },
                            { name: 'PROJECT_ID', value: projectSlug }
                        ]
                    }
                ]
            }
        })

        await ecsClient.send(command);
        const newProject = await prisma.user.update({
            where: {
                id: Number(isUsernameExists.id)
            }, data: {
                Project: {
                    create: {
                        projectId: projectSlug,
                        status: 'uploaded',
                        liveurl: `http://${projectSlug}.localhost:8000`
                    }
                }
            }
        })

        return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` }, project: newProject })

    } catch (error) {
        console.log(error.message);
        res.status(501).json({
            error: error.message
        })
    }

})

async function initRedisSubscribe() {
    console.log('Subscribed to logs....')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message)
    })
}


initRedisSubscribe()

app.listen(PORT, () => console.log(`API Server Running..${PORT}`))