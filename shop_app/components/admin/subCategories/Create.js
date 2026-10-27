import { Form, Formik } from "formik";
import styles from "./styles.module.scss";
import * as Yup from "yup";
import AdminInput from "../../inputs/adminInput";
import { toast } from "react-toastify";
import axios from "axios";
import SingularSelect from "../../selects/SingularSelect";

export default function Create({ categories, setSubCategories }) {
  const validate = Yup.object({
    name: Yup.string()
      .required("SubCategory name is required.")
      .min(2, "SubCategory name must be between 2 and 30 characters.")
      .max(30, "SubCategory name must be between 2 and 30 characters."),
    parent: Yup.string().required("Please choose a parent category."),
  });

  const submitHandler = async (values, { resetForm }) => {
    try {
      const { data } = await axios.post("/api/admin/subCategory", {
        name: values.name,
        parent: values.parent,
      });
      setSubCategories(data.subCategories);
      resetForm();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ name: "", parent: "" }}
        validationSchema={validate}
        onSubmit={submitHandler}
      >
        {(formik) => (
          <Form>
            <div className={styles.header}>Create a SubCategory</div>
            <AdminInput
              type="text"
              label="Name"
              name="name"
              placeholder="Sub-Category name"
            />
            <SingularSelect
              name="parent"
              value={formik.values.parent}
              data={categories}
              placeholder="Select Category"
              header="Select Category"
              // ✅ Передаем напрямую значение через setFieldValue вместо handleChange
              handleChange={(e) => {
                const value = e.target ? e.target.value : e;
                formik.setFieldValue("parent", value);
              }}
            />
            <div className={styles.btnWrap}>
              <button type="submit" className={`${styles.btn} `}>
                <span>Add SubCategory</span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}