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
    <div className="flex flex-col items-center justify-center my-12">
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
            {currentInfo?.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.projectId}</TableCell>
                <TableCell>Nan</TableCell>
                <TableCell>Nan</TableCell>
                <TableCell>{project.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
