import React from 'react';

function InformationPage({ actionType, message, onConfirm, onCancel }) {
  const renderButtons = () => {
    if (actionType === 'delete') {
      return (
        <>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </>
      );
    } else {
      return <button onClick={onConfirm}>OK</button>;
    }
  };

  return (
    <div className="information-page">
      <div className="message">
        <p>{message}</p>
      </div>
      <div className="buttons">
        {renderButtons()}
      </div>
    </div>
  );
}

export default InformationPage;