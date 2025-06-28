import {  Outlet } from 'react-router'

const MainLayout = () => {
    return (
        <div className="wrapper" style={{width:'100%',height: '100%',display: 'flex', justifyContent: 'center',alignItems:'center', background:'#4070F4'}}>
            <Outlet/>
        </div>
    )
}

export default MainLayout