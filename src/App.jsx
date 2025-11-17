import React from 'react'
import Layout from './components/Layout'
import Hero from './components/Hero'
import Snapshot from './components/Snapshot'
import ApplicationForm from './components/ApplicationForm'

export default function App(){
  return (
    <Layout>
      <Hero />
      <Snapshot />
      <ApplicationForm />
    </Layout>
  )
}
