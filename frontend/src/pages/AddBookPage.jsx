import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup"; // Correctly import `yup`

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  author: yup.string().required("Author is required"),
  coverUrl: yup.string().url("Must be a valid URL").nullable(),
  isbn: yup.string().required("ISBN is required"),
  publisher: yup.string().required("Publisher is required"),
  publishedYear: yup.number()
    .required("Published year is required")
    .min(1000)
    .max(new Date().getFullYear()),
  pages: yup.number().required("Pages are required").positive().integer()
});

const AddBookPage = () => {
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      title: "",
      author: "",
      coverUrl: "",
      isbn: "",
      publisher: "",
      publishedYear: new Date().getFullYear(),  // Correctly assign current year
      pages: ""  // Initialize pages as an empty string
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Submitted book:", values);
      toast({ title: "Book added successfully!" });
    }
  });

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
        <CardDescription>Fill in the details below to add a new book.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {["title", "author", "isbn", "publisher", "publishedYear", "pages", "coverUrl"].map((field) => (
            <div key={field}>
              <label className="block font-medium capitalize">{field}</label>
              <Input
                type={["publishedYear", "pages"].includes(field) ? "number" : "text"}
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched[field] && formik.errors[field] && (
                <div className="text-red-500 text-sm">{formik.errors[field]}</div>
              )}
            </div>
          ))}
          <div>
            <label className="block font-medium">Description</label>
            <Textarea
              name="description"
              value={formik.values.description || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <Button type="submit">Add Book</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBookPage;
