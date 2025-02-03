// import { Dog } from '../types/index';


const toggleLike = (data, setLiked) => {
    setLiked((prev) => {
      const updated = { ...prev };
  
      if (updated[data.id] && updated[data.id].liked) {
        delete updated[data.id]; 
      } else {
        updated[data.id] = {
          liked: !(prev[data.id]?.liked || false),
          detail: { ...data },
        };
      }
  
      return updated;
    });
  };

  export default toggleLike;