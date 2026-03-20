'use client'

import { useState } from 'react'
import { Settings, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Topbar(){

  const [open,setOpen] = useState(false)

  return (

    <div className="flex justify-end items-center h-16 border-b border-gray-800 px-6">

      <div className="relative">

        <button
        onClick={()=>setOpen(!open)}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">

          <Settings size={18}/>

        </button>

        <AnimatePresence>

        {open && (

          <motion.div
          initial={{opacity:0,y:-10}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-10}}
          className="absolute right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl w-44 shadow-xl">

            <button
            onClick={()=>window.location.href='/'}
            className="flex items-center gap-2 w-full p-3 hover:bg-gray-800">

              <LogOut size={16}/>
              Ausloggen

            </button>

            <button
            onClick={()=>window.location.href='/'}
            className="flex items-center gap-2 w-full p-3 hover:bg-gray-800 text-red-400">

              Kündigen

            </button>

          </motion.div>

        )}

        </AnimatePresence>

      </div>

    </div>

  )
}
