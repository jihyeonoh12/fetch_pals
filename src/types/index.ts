export interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
  }
  
export  interface Liked {
    id: string
    liked: boolean
    detail : Dog
  }