import React from 'react'
import { deleteId } from './Api'

const DeleteForm = ({ closeDeleteModal, idDeleteData, allData, getData }) => {
    
    const handleDelete = (idDeleteData) => {
        
        deleteId(idDeleteData, closeDeleteModal,getData);
        // getData();
    }
    
    return (
        <div>
             <div className="modal-overlay">
                <div className="modal-content">
                    <button className="close-btn" onClick={closeDeleteModal}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>

                    <div className='delete-popup'>
                        <h2>Delete</h2>
                        <p>Are you sure you want to delete <strong>id</strong>?</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={closeDeleteModal}>Cancel</button>
                            <button className="delete-btn" onClick={() => handleDelete(idDeleteData)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }

export default DeleteForm