import React, { useEffect, useState } from 'react'
import { updateId } from './Api';

const EditForm = ({ closeModal, allData, idData, getData }) => {
    
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [errorsId, setIdErrors] = useState({});
  const editData = allData?.find((ids) => ids._id == idData);
    
    useEffect(() => {
        if (editData) {
          setEditFormData({
              url_id: editData.url_id,
              name: editData.name,
              source: editData.source,
              destination: editData.destination,
              note: editData.note,
          })
        }
    }, []);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditFormData({ ...editFormData, [name]: value });
      
      //For limit in notes
      //  if (name === 'note' && value.length <= 200) {
      //     setEditFormData({ ...editFormData, [name]: value });
      //   } else if (name !== 'note') {
      //    setEditFormData({ ...editFormData, [name]: value });   
      //   }
    }
  
      const handleSave = (e) => {
          e.preventDefault();

          const formErrors = validateForm(editFormData);
          const sourceUrlErrors = validateSourceUrl(editFormData);

          if (Object.keys(formErrors).length > 0) {
              setErrors(formErrors);
              return;
          }

          if (Object.keys(sourceUrlErrors.source).length > 0) {
              setIdErrors(sourceUrlErrors);
              return; 
          }

          updateId(idData, editFormData, closeModal);
          getData();
      }

      const validateForm = (data) => {
        const errors = {};
        
        if (!data.url_id) {
          errors.url_id = "ID is required";
        }else if (!/^\d+$/.test(data.url_id)) { 
          errors.url_id = "ID must be a number";
        }

        if (!data.source) {
          errors.source = "Source is required";
        }

        if (!data.destination) {
          errors.destination = "Destination is required";
        }
        if (data.note && data.note.length > 200) {
          errors.note = "Note cannot exceed 200 characters";
        }if (data.note && data.note.length > 200) {
          errors.note = "Note cannot exceed 200 characters";
        }

        return errors;
      };
  
      const validateSourceUrl = (data) => {
          const errors = {
              source: ""
          };

          let hasErrors = false;

          if (data.source) {
              try {
                  const sourceUrl = new URL(data.source);
                  const sourceIdParam = sourceUrl.searchParams.get('id');

                  if (!sourceIdParam) {
                      errors.source = 'Source URL must contain an id parameter';
                      hasErrors = true;
                  } else if (sourceIdParam !== data.url_id) {
                      errors.source = 'ID parameter in source URL must match ID field';
                      hasErrors = true;
                  }

              } catch (error) {
                  console.error('Error during URL validation:', error);
                  errors.source = 'An error occurred during URL validation';
                  hasErrors = true;
              }
        }
          return errors;
      };



    return (
      <div>
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
              <div className='edit-popup'>
                <h2>Edit</h2>
                <form >
                    <div className="edit-box-form">
                    <div className="input-box">
                      <input
                        type="text"
                          className="input-field"
                          name="url_id"
                          placeholder="ID"
                          value={editFormData.url_id}
                          onChange={handleChange}
                    />
                    {errors.url_id && <div className="error-message">{errors.url_id}</div>}
                    </div>
                    <div className="input-box">
                      <input
                        type="text"
                        id="username"
                        className="input-field"
                        placeholder="Name"
                        name="name"
                        value={editFormData.name}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="input-box">
                      <input
                        type="text"
                        id="source"
                        className="input-field"
                        placeholder="Enter Source"
                        name="source"
                        value={editFormData.source}
                        onChange={handleChange}
                    />
                    {errors.source && <div className="error-message">{errors.source}</div>} 
                    {errorsId.source && <div className="error-message">{errorsId.source}</div>}
                    </div>
                    <div className="input-box">
                      <input
                        id="username"
                        className="input-field"
                        placeholder="Enter Destination"
                        name="destination"
                        value={editFormData.destination}
                        onChange={handleChange}
                    />
                    {errors.destination && <div className="error-message">{errors.destination}</div>}
                    </div>
                    <div className="textarea-box">
                    <textarea style={{ resize: "none" }} id="notes" rows="2" placeholder="Add Notes" name="note" value={editFormData.note} onChange={handleChange}></textarea>
                    {errors.note && <div className="error-message">{errors.note}</div>}
                    </div>                
                    </div>
                    <button className="save-button" type="submit" onClick={handleSave}>Save</button>
                </form>
              </div>
          </div>
        </div>
      </div>
    )
}

export default EditForm