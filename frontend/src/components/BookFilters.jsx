import { useEffect } from "react";
import { useFormik } from "formik";
import * as "yup";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const validationSchema = Yup.object({
  genre.string().nullable(),
  availability.string().nullable(),
  sortBy.string().required("Sort option is required"),
  search.string().nullable(),
});

type BookFiltersProps = {
  onFilterChange: (values) => void;
  initialFilters?: {
    genre?;
    availability?;
    sortBy;
    search?;
  };
};

const BookFilters = ({ onFilterChange, initialFilters }) => {
  const formik = useFormik({
    initialValues: {
      genre?.genre || "",
      availability?.availability || "",
      sortBy?.sortBy || "",
      search?.search || "",
    },
    validationSchema,
    onSubmit: (values) => {
      onFilterChange(values);
    },
  });

  useEffect(() => {
    onFilterChange(formik.values);
  }, [formik.values, onFilterChange]);

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 md-row md-end">
      <div>
        <label>Genre</label>
        <Input
          name="genre"
          value={formik.values.genre}
          onChange={formik.handleChange}
        />
      </div>
      <div>
        <label>Availability</label>
        <Input
          name="availability"
          value={formik.values.availability}
          onChange={formik.handleChange}
        />
      </div>
      <div>
        <label>Sort By</label>
        <Select
          onValueChange={(val) => formik.setFieldValue("sortBy", val)}
          value={formik.values.sortBy}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="publishedYear">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label>Search</label>
        <Input
          name="search"
          value={formik.values.search}
          onChange={formik.handleChange}
        />
      </div>
      <Button type="submit">Apply</Button>
    </form>
  );
};

export default BookFilters;