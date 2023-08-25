import { useState } from 'react'
import { useGetIdentity } from '@pankod/refine-core'
import { FieldValue, FieldValues, useForm } from '@pankod/refine-react-hook-form'
import { useNavigate } from '@pankod/refine-react-router-v6'
import Form from 'components/common/Form'
import ProblemsForm from 'components/common/ProblemsForm'


const CreateProblem = () => {
  const navigate = useNavigate()
  const { data:user } = useGetIdentity()
  if (user?.email !== process.env.REACT_APP_ADMIN_USER) {
    navigate('/')
  }
  if (!user) {
    navigate('/')
  }

  const { refineCore: { onFinish, formLoading }, register, handleSubmit } = useForm()

  const onFinishHandler = async(data:FieldValues) => {
    await onFinish({ ...data, email: user.email})
  }

  return (
    <ProblemsForm 
      type="Create"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}
    />
  )
}

export default CreateProblem