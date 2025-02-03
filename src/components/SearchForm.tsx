import React from 'react';


const SearchForm = (
{   breedList, 
    handleSubmit, 
    selectedBreed, 
    setSelectedBreed, 
    sortMethod, 
    setSortMethod, 
    zipCode,
    setzipCode
} : {
    breedList : string[],
    handleSubmit : (e: React.FormEvent<HTMLFormElement>) => Promise<void>, 
    selectedBreed: string, 
    setSelectedBreed: (prop:string) => void, 
    sortMethod: string, 
    setSortMethod:(prop:string) => void, 
    zipCode: string,
    setzipCode: (prop:string) => void, 
}) => {
    return (
        <form action="" onSubmit={handleSubmit} className="w-700 d-md-flex my-3 mx-auto">
        <select className="form-select m-1" onChange={(e) => setSelectedBreed(e.target.value)} value={selectedBreed}>
            <option value="">All Breeds</option>
            {breedList && breedList.map((breed) => (
                <option key={breed} value={breed}>
                {breed}
                </option>
            ))}
         </select>
         <input pattern="[0-9]{5}" maxLength={5} className="form-control m-1 w-md-25" placeholder="zipcode" type="text" onChange={(e) => setzipCode(e.target.value)} value={zipCode} />
         <select className="form-select m-1" value={sortMethod} onChange={(e) => setSortMethod(e.target.value)}>
            <option value="ascending">Sort A-Z</option>
            <option value="descending">Sort Z-A</option>
          </select>
          <button className="btn btn-primary m-1 container-fluid">Search</button>
         </form>
    )
}

export default SearchForm;