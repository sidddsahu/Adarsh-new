// import React, { useEffect, useState } from "react";
// import { FaCheck } from "react-icons/fa";
// import axios from "../../../Config/axios";
// import Loader from "../../Loader";
// import toast from "react-hot-toast";

// const AddCompany = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     contactPerson: "",
//     designation: "",
//     city: "",
//     address: "",
//     mobile: "",
//     alternateMobile: "",
//     email: "",
//     whatsapp: "",
//     gstNumber: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitSuccess(false);

//     setLoading(true);
//     try {
//       const res = await axios.post("/company", formData);
//       console.log(res.data);
//       setSubmitSuccess(true);
//       toast.success("Brand created successfully!");
//       // Optionally reset form
//       setFormData({
//         name: "",
//         contactPerson: "",
//         designation: "",
//         city: "",
//         address: "",
//         mobile: "",
//         alternateMobile: "",
//         email: "",
//         whatsapp: "",
//         gstNumber: "",
//       });
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to create Brand");
//     } finally {
//       setIsSubmitting(false);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       // Check if Ctrl + Q is pressed
//       if (e.ctrlKey && e.key.toLowerCase() === "q") {
//         e.preventDefault();
//         // Manually trigger form submit
//         document.getElementById("add-company-form")?.requestSubmit();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className=''>
//       <div className='card shadow-lg'>
//         <div className='card-header bg-primary text-white'>
//           <h3 className='card-title'>Create Brand</h3>
//           <div className='card-tools'>
//             <button
//               type='button'
//               className='btn btn-tool'
//               data-card-widget='collapse'
//             >
//               <i className='fas fa-minus'></i>
//             </button>
//           </div>
//         </div>

//         <form id='add-company-form' onSubmit={handleSubmit}>
//           <div className='card-body'>
//             <div className='row'>
//               <div className='col-md-4'>
//                 <div className='form-group'>
//                   <label className='font-weight-bold'>Brand Name</label>
//                   <input
//                     name='name'
//                     className='form-control'
//                     placeholder='Brand Name'
//                     value={formData.name}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className='card-footer text-center'>
//             <button
//               type='submit'
//               className='btn btn-success btn-lg px-5'
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <span
//                     className='spinner-border spinner-border-sm mr-2'
//                     role='status'
//                     aria-hidden='true'
//                   ></span>
//                   Processing...
//                 </>
//               ) : submitSuccess ? (
//                 <>
//                   <FaCheck className='mr-2' /> Company Created Successfully!
//                 </>
//               ) : (
//                 "Create Company"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCompany;
import React, { useEffect, useState, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import axios from "../../../Config/axios";
import Loader from "../../Loader";
import toast from "react-hot-toast";

const AddCompany = ({ brandNameRef }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const internalNameRef = useRef(null);
  const nameRef = brandNameRef || internalNameRef;

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    designation: "",
    city: "",
    address: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    whatsapp: "",
    gstNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setLoading(true);
    try {
      const res = await axios.post("/company", formData);
      console.log(res.data);
      setSubmitSuccess(true);
      toast.success("Brand created successfully!");
      setFormData({
        name: "",
        contactPerson: "",
        designation: "",
        city: "",
        address: "",
        mobile: "",
        alternateMobile: "",
        email: "",
        whatsapp: "",
        gstNumber: "",
      });
      // keep focus on name after successful submit
      setTimeout(() => {
        if (nameRef.current) nameRef.current.focus();
      }, 50);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Brand");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Keyboard funnel and submit shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true");

      // Ctrl+Q -> submit
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        document.getElementById("add-company-form")?.requestSubmit();
        return;
      }

      // Funnel typing into brand name if nothing specific is focused
      if (!isInputFocused) {
        if ((e.key.length === 1 && !e.ctrlKey && !e.metaKey) || e.key === "Backspace") {
          e.preventDefault();
          if (nameRef.current) {
            nameRef.current.focus();
            setTimeout(() => {
              setFormData((prev) => {
                let newName = prev.name;
                if (e.key === "Backspace") {
                  newName = newName.slice(0, -1);
                } else {
                  newName = newName + e.key;
                }
                return { ...prev, name: newName };
              });
            }, 0);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nameRef]);

  // Autofocus brand name when component mounts
  useEffect(() => {
    setTimeout(() => {
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }, 50);
  }, [nameRef]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className=''>
      <div className='card shadow-lg'>
        <div className='card-header bg-primary text-white'>
          <h3 className='card-title'>Create Brand</h3>
          <div className='card-tools'>
            <button
              type='button'
              className='btn btn-tool'
              data-card-widget='collapse'
            >
              <i className='fas fa-minus'></i>
            </button>
          </div>
        </div>

        <form id='add-company-form' onSubmit={handleSubmit}>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-4'>
                <div className='form-group'>
                  <label className='font-weight-bold'>Brand Name</label>
                  <input
                    id='brand-name-input'
                    name='name'
                    className='form-control'
                    placeholder='Brand Name'
                    value={formData.name}
                    onChange={handleChange}
                    ref={nameRef}
                    autoComplete='off'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='card-footer text-center'>
            <button
              type='submit'
              className='btn btn-success btn-lg px-5'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className='spinner-border spinner-border-sm mr-2'
                    role='status'
                    aria-hidden='true'
                  ></span>
                  Processing...
                </>
              ) : submitSuccess ? (
                <>
                  <FaCheck className='mr-2' /> Company Created Successfully!
                </>
              ) : (
                "Create Company"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
