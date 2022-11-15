import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import { Field } from './field';
import { updateConfig } from '../../utils/get-data';
import { useAuth } from '../../context/auth.context';
import { useNotification } from '../../context/notification.context';

export const UpdateForm = ({ selectedValue, setModalOpen }) => {
  const { setShouldUpdateConfigs, setShouldUpdateFarms } = useAuth();
  const { setHasError, showNotification} = useNotification();
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      config: {
        name: selectedValue.name,
        percent: selectedValue.percent_from_24h,
        wallets: Object.entries(selectedValue.wallets)
      }
    }
  });

  const { fields, remove } = useFieldArray({
    control,
    name: 'config.wallets'
  });

  const handleResponse = (response) => {
    if (response.ok) {
      setHasError(false);
      showNotification('Config successfully updated');
      setModalOpen(false);
      setShouldUpdateConfigs(true);
      setShouldUpdateFarms(true);
      return response.json();
    }

    if (!response.ok) {
      showNotification(response.statusText)
      setHasError(true);
      return Promise.reject(response);
    }
  }

  const onSubmit = (data) => {
    const configData = {
      name: data.config.name,
      id: selectedValue.id,
      percent_from_24h: data.config.percent,
      wallets: data.config.wallets.reduce((prevWallet, [name, address]) => ({
        ...prevWallet,
        [name]: address
      }), {})
    }

    updateConfig(configData, selectedValue?.id).then(handleResponse);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="modal__label">
        <span className="accordion__main-text">Name:</span>
        <input
          {...register('config.name')}
          className="modal__input_tr"
          type="text"
          autoComplete="off"
        />
      </label>

      <label className="modal__label">
        <span className="accordion__main-text">Percent:</span>
        <input
          {...register('config.percent')}
          className="modal__input_tr"
          type="text"
          autoComplete="off"
        />
      </label>

      <p className="modal__title">Wallets</p>

      {fields.map((field, index) => (
        <Field
          key={field.id}
          index={index}
          register={register}
          remove={remove}
        />
      ))}

      <div className="modal__grid">
        <button
          className="modal__button"
          type="submit"
        >
          Add
        </button>

        <button
          className="modal__button"
          type="button"
          onClick={() => reset()}
        >
          Reset
        </button>
      </div>
    </form>
  );
};
