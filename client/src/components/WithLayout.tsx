import React from 'react'
import Layout from './Layout'

function WithLayout<P extends object = object>(WrappedComponent: React.ComponentType<P>) {
    return (props: P) => {
        return (
            <Layout>
                <WrappedComponent {...props}/>
            </Layout>
        )
    }
    
  
}

export default WithLayout