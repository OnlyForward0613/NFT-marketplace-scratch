import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto top-0 right-0 left-0">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="z-10 bg-white p-4 max-w-md m-auto rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;