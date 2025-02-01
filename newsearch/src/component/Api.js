import instance from './api_instance';

const token = localStorage.getItem('token');
console.log(token,"token")

export const loginUser = async (formData, navigate) => {

  try {
    const res = await instance({
      url: "auth/login", 
      method: "POST",
      data: formData,
    });

    if (res?.data?.data) {
      localStorage.setItem("token", res?.data?.data);
      localStorage.setItem("username",formData.email);
      navigate("/dashboard");
    } else {
      console.log("Login failed: no data in response");
    }
  } catch (e) {
    console.error("Error during login:", e);
  }
};

export const SignupUser = async (formData, navigate) => {
    try {
        const res = await instance({
            url: "auth/signup", 
            method: "POST",
            data: formData,
        });

        if (res?.data?.data) {
            // Assuming res.data.data contains the token
            localStorage.setItem("token", res?.data?.data);
            localStorage.setItem("username", formData.email);

            // Navigate to the login page (or other page if needed)
            navigate("/"); 
        } else {
            console.log("Registration failed: No data in response");
        }
    } catch (e) {
        console.error("Error during signup:", e);
    }
};

export const createId = async (createFormData, setCreateFormData) => {
    try {
        const token = localStorage.getItem('token');

        const headers = {
            Authorization: `Bearer ${token}`, 
        };

        const res = await instance({
            url: "/url/create",  
            method: "POST",
            data: createFormData,
            headers: headers 
        });
        
        if (res.data) {
            setCreateFormData({
                destination: "",
                name: "",
                source: "",
                url_id: ""
            })
        }
    } catch (e) {
        console.error("Error during creation:", e);
    }
};


export const deleteId = async (idDeleteData, closeDeleteModal, getData) => {
    try {

        const headers = {
            Authorization: `Bearer ${token}`, 
        };

        const res = await instance({
            url: `/url/${idDeleteData}`,  
            method: "DELETE",
            headers: headers 
        });
       
        if (res.status) {
            closeDeleteModal();
            getData();
        }
    } catch (e) {
        console.error("Error during creation:", e);
    }
};

export const updateId = async (id, editFormData, closeModal) => {
    const token = localStorage.getItem('token');
    
    try {

        const headers = {
            Authorization: `Bearer ${token}`, 
        };

        const res = await instance({
            url: `/url/${id}`,  
            method: "PUT",
            headers: headers,
            data: editFormData,            
        });
        // return res
        if (res.status) {
            closeModal()
        }
    } catch (e) {
        console.error("Error during creation:", e);
    }
};
