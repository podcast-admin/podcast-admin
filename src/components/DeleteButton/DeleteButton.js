import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { deleteDoc } from 'firebase/firestore';

const DeleteButton = ({ doc, redirectTo, disabled }) => {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const handleClick = async () => {
    const answer = window.confirm(t('DeleteButton.message'));
    if (answer) {
      await deleteDoc(doc);
      redirectTo && navigate(redirectTo);
    }
  };

  return (
    <Button onClick={handleClick} color="secondary" disabled={disabled}>
      {t('DeleteButton.label')}
    </Button>
  );
};

export default DeleteButton;
