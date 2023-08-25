import { BaseKey } from '@pankod/refine-core';

export interface FormFieldProp {
  title: string,
  labelName: string
}

export interface FormValues {
    title: string,
    description: string,
    propertyType: string,
    location: string,
    price: number | undefined,
}

export interface PostCardProps {
  id?: BaseKey | undefined,
  title: string,
  tech: string,
  description: string,
  header: string,
  header2: string,
  header3: string,
  imgurl: string,
  postType: string,
  photo: string,
  photo2: string,
  photo3: string,
  photo4: string,
}
