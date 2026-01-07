import React, { useEffect } from 'react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Directly download the PDF
      const link = document.createElement('a');
      link.href = '/Muhammad Taaha.pdf';
      link.download = 'Muhammad_Taaha_Resume.pdf';
      link.click();
      
      // Close immediately after triggering download
      onClose();
    }
  }, [isOpen, onClose]);

  return null;
};

export default ResumeModal;