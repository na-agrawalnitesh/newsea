import React, { useEffect, useState } from 'react'
import EditForm from './EditForm';
import DeleteForm from './DeleteForm';
import { useNavigate } from 'react-router-dom';
import { createId } from './Api';
import instance from './api_instance';


const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState({});
    const [allData, setAllData] = useState([]);
    const [idData, setIdData] = useState("");
    const [idDeleteData, setIdDeleteData] = useState("");
    const [loginName, setLoginName] = useState("");
    const [errors, setErrors] = useState({});
    
    const getData = async () => {
        try {
            const token = localStorage.getItem('token');

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const res = await instance({
                url: "/url/get",
                method: "GET",
                headers: headers,
            });

            setAllData(res?.data?.data)
            return res.data;

        } catch (e) {
            console.error("Error during GET request:", e);
        }
    }
    
    useEffect(() => {
        getData();
        const userLoginName = localStorage.getItem("username");
        setLoginName(userLoginName)
    }, []);
    
    const navigate = useNavigate();
    
    const openModal = (id) => {
        setIsModalOpen(true);
        setIdData(id);
    }

    const closeModal = () => setIsModalOpen(false);
    
    const openDeleteModal = (delId) => {
        setIsDeleteModalOpen(true);
        setIdDeleteData(delId)
    }
    
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreateFormData({ ...createFormData, [name]: value }); 
    }
    
    const validateForm = (data) => {
        const errors = {};

        if (!data.url_id) {
        errors.url_id = "ID is required";
        } else if (!/^\d+$/.test(data.url_id)) {
        errors.url_id = "ID must be a number";
            }
        // if (!data.url_id) {
        //   errors.url_id = "ID is required";
        // } else if (!/^\d{10}$/.test(data.url_id)) {
        //   errors.url_id = "ID must be exactly 10 digits and contain only numbers";
        // }

        if (!data.source) {
        errors.source = "Source is required";
        }

        if (!data.destination) {
        errors.destination = "Destination is required";
        }

        return errors;
    };
    
    const handleCreate = async (e) => {
        e.preventDefault();
        
        // Reset previous errors
        setErrors({
            url_id: '',
            source: '',
            destination: ''
        });

        let hasErrors = false;
        const newErrors = {
            url_id: '',
            source: '',
            destination: ''
        };

        // Form validation
        if (!createFormData.url_id?.trim()) {
            newErrors.url_id = 'ID field is required';
            hasErrors = true;
        }

        if (!createFormData.source?.trim()) {
            newErrors.source = 'Source URL is required';
            hasErrors = true;
        }

        if (!createFormData.destination?.trim()) {
            newErrors.destination = 'Destination URL is required';
            hasErrors = true;
        }

        // URL format validation
        if (createFormData.source) {
            try {
                const sourceUrl = new URL(createFormData.source);
                const sourceIdParam = sourceUrl.searchParams.get('id');
                
                if (!sourceIdParam) {
                    newErrors.source = 'Source URL must contain an id parameter';
                    hasErrors = true;
                } else if (sourceIdParam !== createFormData.url_id) {
                    newErrors.source = 'ID parameter in source URL must match ID field';
                    hasErrors = true;
                }

                if (!hasErrors) {
                    const searchParams = sourceUrl.searchParams.toString();
                    if (searchParams) {
                        setCreateFormData(prev => ({
                            ...prev,
                            destination: prev.destination ? `${prev.destination}?${searchParams}` : `?${searchParams}`
                        }));
                    }
                }
            } catch (error) {
                console.error('Error during URL validation:', error);
                newErrors.source = 'An error occurred during URL validation';
                hasErrors = true;
            }
        }

        if (createFormData.destination) {
            try {
                new URL(createFormData.destination);
            } catch (error) {
                newErrors.destination = 'Please enter a valid destination URL';
                hasErrors = true;
            }
        }

        setErrors(newErrors);
        
        if (!hasErrors) {
            await createId(createFormData, setCreateFormData);
            await getData();
        }
    }
    
    const handleLogout = () => {
        const tokenData = localStorage.removeItem("token");
        const nameUser = localStorage.removeItem("username")
        
        if (!tokenData && !nameUser) {
            navigate("/");
        }
    }
    
    const formatDate = (date) => {
    
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return (
            <>
                {`${mm}/${dd}/${yyyy}`}
                <br />
                <br />
                Time - {hours}:{minutes}
            </>
        );
    };
    
    
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const handleKeyPress = (e) => {

        if (!/^\d$/.test(e.key)) {
        e.preventDefault();
        }
    };
    
    return (
        <>
        {isModalOpen ? (<EditForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} allData={allData} idData={ idData } getData={ getData }/>) : null}
        {isDeleteModalOpen ? (<DeleteForm isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} closeDeleteModal={closeDeleteModal} allData={allData} idDeleteData={idDeleteData} getData={ getData } />): null}
        
        <div className="dashboard-main">
            <div>
                <div className="header-dashboard">
                    <div className="main-container header-container">
                        <h1>Dashboard</h1>
                        <div className="welcome-text">
                                Welcome, { loginName }  
                            <a onClick={handleLogout}>
                                Log Out
                            </a>
                        </div>
                    </div>
                </div>
                <div className="create-new-id">
                    <div className="main-container">
                        <h3>create new id</h3>
                        <div className="white-box-container">
                            <form>
                            <div className="white-wrap-container">
                                <div className="input-box dash-input-01">
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="ID"
                                        name="url_id"
                                        value={createFormData.url_id}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress} 
                                        maxLength={10}
                                    />
                                   {errors.url_id && <div className="error-message">{errors.url_id}</div>}
                                </div>
                               
                                <div className="input-box dash-input-02">
                                    <input
                                        type="text"
                                        id="username"
                                        className="input-field"
                                        placeholder="Enter Source"
                                        name="source"
                                        value={createFormData.source}
                                        onChange={handleChange}
                                    />
                                    {errors.source && <div className="error-message">{errors.source}</div>}
                                </div>
                                <div className="input-box dash-input-03">
                                    <input
                                        id="username"
                                        className="input-field"
                                        placeholder="Enter Destination"
                                        name="destination"
                                        value={createFormData.destination}
                                        onChange={handleChange}
                                    />
                                    {errors.destination && <div className="error-message">{errors.destination}</div>}
                                </div>
                                <div className="input-box input-box-submit">
                                    <button onClick={handleCreate}>Submit</button>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                    <div className="main-container">
                        <h3>Existing Id</h3>
                        <div className="white-box-container">
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Id</th>
                                            <th>Source</th>
                                            <th>Destination</th>
                                            <th>Name</th>
                                            <th>Notes</th>
                                            <th>Updated at</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allData && allData?.length > 0 ? (
                                            allData.map((idData, index) => {
                                                return (
                                                <tr key={idData._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{idData?.url_id}</td>
                                                    <td><a>{idData?.source}</a></td>
                                                    <td>{idData?.destination}</td>
                                                    <td>{idData?.name}</td>
                                                        {/* <td>{idData?.note}</td> */}
                                                    <td>{idData?.note ? truncateText(idData?.note, 30) : ""}</td>
                                                    <td>{formatDate(new Date(idData?.updatedAt))}</td>
                                                    <td>
                                                    <div className="button-content">
                                                        <button className="edit-btn" onClick={() => openModal(idData._id)}>edit</button>
                                                        <button className="delete-btn" onClick={() => openDeleteModal(idData._id)}>delete</button>
                                                    </div>
                                                    </td>
                                                </tr>
                                                );
                                            })
                                            ) : (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: "center" }}>No data found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Dashboard