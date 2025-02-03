import React from 'react';

const TabBanner = ({tab, setTab} : {tab: string, setTab:(prop: string) => void}) => {
    return (
        <div className="text-center">
        <h2 className="text-primary"><strong>Welcome to Fetch Pals</strong></h2>
        <p>Where wagging tails and happy hearts meet.</p>
        <ul className="nav nav-underline d-flex justify-content-center py-3">
          <li className="nav-item">
            <button onClick={() => setTab("searchTab")} className={`nav-link ${tab === 'searchTab' && 'active'}`} aria-current="page" >Search</button>
          </li>
          <li className="nav-item">
            <button onClick={() => setTab("favoriteTab")} className={`nav-link ${tab === 'favoriteTab' && 'active'}`} >Favorite</button>
          </li>
        </ul>
      </div>
    )
}

export default TabBanner;