"use client";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function Component() {
  const [currentInfo, setCurrentInfo] = useState([]);
  const [loading, setLoading] = useState<boolean>();
  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      setLoading(true);
      const resp = await axios.post(`http://localhost:9000/getprojects`, {
        id: localStorage.getItem("userId"),
      });
      if (!resp) throw new Error();
      console.log(resp.data);
      setCurrentInfo(resp.data.project);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen  bg-slate-950">
      <div className="flex flex-col items-center justify-center pt-16 ">
        <h2 className="text-2xl font-bold mb-4">Your Projects Status</h2>
        <div className="border rounded-lg shadow-sm w-full max-w-4xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Project-Name</TableHead>
                <TableHead className="font-medium">Live-URl</TableHead>
                <TableHead className="font-medium">Price</TableHead>
                <TableHead className="font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key={1}>
                <TableCell>1</TableCell>
                <TableCell>Project A</TableCell>
                <TableCell>https://example.com/projectA</TableCell>
                <TableCell>In Progress</TableCell>
              </TableRow>
              <TableRow key={2}>
                <TableCell>2</TableCell>
                <TableCell>Project B</TableCell>
                <TableCell>https://example.com/projectB</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
              <TableRow key={3}>
                <TableCell>3</TableCell>
                <TableCell>Project C</TableCell>
                <TableCell>https://example.com/projectC</TableCell>
                <TableCell>Paused</TableCell>
              </TableRow>

              {/*   {currentInfo?.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.projectId}</TableCell>
                <TableCell>Nan</TableCell>
                <TableCell>Nan</TableCell>
                <TableCell>{project.status}</TableCell>
              </TableRow>
            ))} */}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
