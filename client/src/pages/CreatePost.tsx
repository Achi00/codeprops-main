import { useState } from 'react'
import { useGetIdentity } from '@pankod/refine-core'
import { FieldValue, FieldValues, useForm } from '@pankod/refine-react-hook-form'
import { useNavigate } from '@pankod/refine-react-router-v6'
import Form from 'components/common/Form'


const CreatePost = () => {
  const navigate = useNavigate()
  const { data:user } = useGetIdentity()
  if (user?.email !== process.env.REACT_APP_ADMIN_USER) {
    navigate('/')
  }
  if (!user) {
    navigate('/')
  }
  const [ postImage, setPostImage ] = useState({name: '', url: ''})
  const [ postImage2, setPostImage2 ] = useState({name: '', url: ''})
  const [ postImage3, setPostImage3 ] = useState({name: '', url: ''})
  const [ postImage4, setPostImage4 ] = useState({name: '', url: ''})
  const { refineCore: { onFinish, formLoading }, register, handleSubmit } = useForm()

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) =>
    new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
    });

    reader(file).then((result: string) =>
    setPostImage({ name: file?.name, url: result }),
  );
  }
  const handleImageChange2 = (file: File) => {
    const reader = (readFile: File) =>
    new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
    });

    reader(file).then((result: string) =>
    setPostImage2({ name: file?.name, url: result }),
  );
  }
  const handleImageChange3 = (file: File) => {
    const reader = (readFile: File) =>
    new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
    });

    reader(file).then((result: string) =>
    setPostImage3({ name: file?.name, url: result }),
  );
  }
  const handleImageChange4 = (file: File) => {
    const reader = (readFile: File) =>
    new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
    });

    reader(file).then((result: string) =>
    setPostImage4({ name: file?.name, url: result }),
  );
  }
  const onFinishHandler = async(data:FieldValues) => {
    if(!postImage.name || !postImage2.name) return alert("Please Select Image")
    await onFinish({ ...data, photo: postImage.url, photo2: postImage2.url, email: user.email, photo3: postImage3.url, photo4: postImage4.url})
  }

  return (
    <Form 
      type="Create"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      postImage={postImage}
      postImage2={postImage2}
      postImage3={postImage3}
      postImage4={postImage4}
      handleImageChange={handleImageChange}
      handleImageChange2={handleImageChange2}
      handleImageChange3={handleImageChange3}
      handleImageChange4={handleImageChange4}
      onFinishHandler={onFinishHandler}
    />
  )
}

export default CreatePost