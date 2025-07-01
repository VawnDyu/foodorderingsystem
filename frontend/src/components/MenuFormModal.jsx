import { useEffect, useState } from 'react';
import styles from './MenuFormModal.module.css';
import InputWithIcon from '../components/InputWithIcon';
import { MdOutlineRestaurantMenu, MdImage, MdCategory, MdOutlineDescription } from "react-icons/md";
import { IoIosPricetag } from "react-icons/io";

// Cloudinary upload API
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;  // Set your Cloudinary upload preset
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL; // Cloudinary URL

const MenuFormModal = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imgUrl: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', price: '', imgUrl: '', description: '', category: '', imageFile: null, previewUrl: '', });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>{initialData ? 'Update Item' : 'Add Item'}</h2>

          <InputWithIcon
            type="text"
            icon={MdOutlineRestaurantMenu}
            name="name"
            placeholder="Food Name"
            value={formData.name}
            onChange={handleChange}
          />

          <InputWithIcon
            type="number"
            icon={IoIosPricetag}
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <div className={styles.inputContainer}>
            <MdOutlineDescription className={styles.icon} />
            <textarea
              className={styles.textareaField}
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <MdCategory className={styles.icon} />
            <select
              className={styles.selectField}
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="drinks">Drinks</option>
              <option value="meals">Meals</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className={styles.inputContainer}>
            <input
              className={styles.inputFile}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  setFormData(prev => ({
                    ...prev,
                    imageFile: file,
                    previewUrl
                  }));

                  // 👇 Call the image upload handler
                  const formUpload = new FormData();
                  formUpload.append('file', file);
                  formUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

                  try {
                    const response = await fetch(CLOUDINARY_URL, {
                      method: 'POST',
                      body: formUpload,
                    });
                    const data = await response.json();

                    if (data.secure_url) {
                      setFormData(prev => ({
                        ...prev,
                        imgUrl: data.secure_url
                      }));
                    }
                  } catch (error) {
                    console.error('Image upload failed:', error);
                  }
                }
              }}
            />
          </div>

          <div className={styles.modalButtons}>
            <button className={styles.saveBtn} type="submit">Save</button>
            <button className={styles.cancelBtn} type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>

        <div className={styles.previewBox}>
          <h2>Preview</h2>

          <div className={styles.imgContainer}>
            <img
              src={formData.previewUrl || formData.imgUrl || null}
              alt='Preview'
              className={styles.previewImage}
            />
          </div>

          <div className={styles.itemContent}>
            <div className={styles.itemHeader}>
              <p><strong>{formData.name || 'Item Name'}</strong></p>
              <p><em>{formData.category ? formData.category.charAt(0).toUpperCase() + formData.category.slice(1) : 'Category'}</em></p>
            </div>
            <p><small>₱ {Number(formData.price || 0).toFixed(2)}</small></p>
            <p><small>{formData.description || 'Item description will appear here.'}</small></p>
          </div>

          <div className={styles.controls}>
            <div className={styles.quantityBtn}>
              <button className={styles.circularBtn}>-</button>
              <span className={styles.quantityLabel}>1</span>
              <button className={styles.circularBtn}>+</button>
            </div>

            <div className={styles.button}>
              <button className={styles.addToCartBtn}>Add to Cart</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MenuFormModal;
