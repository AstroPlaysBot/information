'use client';

import {useParams,useRouter} from 'next/navigation'
import {useState,useEffect} from 'react'

const roles:any={

moderator:{
title:"Moderator",
fields:[
{id:"discordExperience",label:"Hast du Erfahrung mit Discord Moderation?"},
{id:"ticketExperience",label:"Hast du Erfahrung mit Ticketsystemen?"},
{id:"conflictHandling",label:"Wie gehst du mit Konflikten um?"},
{id:"availability",label:"Wie viel Zeit kannst du investieren?"},
{id:"languages",label:"Welche Sprachkenntnisse besitzt du?"},
{id:"phoneReachable",label:"Telefon erreichbar"}
]
},

"backend-developer":{
title:"Backend Developer",
fields:[
{id:"languageExperience",label:"Welche Programmiersprachen beherrschst du?"},
{id:"databaseExperience",label:"Hast du Erfahrung mit Datenbanken?"},
{id:"apiExperience",label:"Hast du Erfahrung mit APIs oder Backend Architekturen?"},
{id:"problemSolving",label:"Beschreibe deine Herangehensweise bei Problemen"},
{id:"phoneReachable",label:"Telefon erreichbar"}
]
},

"frontend-developer":{
title:"Frontend Developer",
fields:[
{id:"frameworkExperience",label:"Frontend Framework Erfahrung"},
{id:"uiExperience",label:"UI/UX Erfahrung"},
{id:"projectPortfolio",label:"Projekt oder Portfolio"},
{id:"teamwork",label:"Teamarbeit Erfahrung"},
{id:"phoneReachable",label:"Telefon erreichbar"}
]
},

betatester:{
title:"Beta Tester",
fields:[
{id:"whyBeta",label:"Warum Beta Tester?"},
{id:"modulesInterest",label:"Welche Module interessieren dich?"},
{id:"priorExperience",label:"Vorherige Erfahrung"},
{id:"phoneReachable",label:"Telefon erreichbar"}
]
},

intern:{
title:"Praktikant",
fields:[
{id:"interestArea",label:"Welchen Bereich möchtest du dir anschauen? (Moderator, Developer, Marketing etc.)"},
{id:"learningGoal",label:"Was möchtest du bei uns lernen?"},
{id:"experience",label:"Hast du bereits Erfahrung?"},
{id:"phoneReachable",label:"Telefon erreichbar"}
]
},

"promotion-manager":{
title:"Promotion Manager",
fields:[
{id:"platforms",label:"Wo würdest du Werbung machen? (Instagram / TikTok / YouTube / Twitch)"},
{id:"audience",label:"Wie groß ist deine Reichweite?"},
{id:"promotionIdeas",label:"Welche Ideen hast du um den Bot zu promoten?"},
{id:"phoneReachable",label:"Telefon erreichbar"}
]
}

}

export default function ApplyRole(){

const router=useRouter()
const params=useParams()
const role=params.role as string

const config=roles[role]

const [user,setUser]=useState<any>(null)
const [form,setForm]=useState<any>({age:'',email:''})

useEffect(()=>{

async function load(){

const res=await fetch('/api/me',{credentials:'include'})

if(!res.ok){

sessionStorage.setItem(
'apply_error_toast',
JSON.stringify({message:"Discord Login fehlgeschlagen"})
)

router.replace('/apply')
return

}

const data=await res.json()
setUser(data.user)

}

load()

},[])

function handleChange(e:any){

setForm({...form,[e.target.name]:e.target.value})

}

async function submit(e:any){

e.preventDefault()

const answers:any={}

config.fields.forEach((f:any)=>{
answers[f.label]=form[f.id]
})

await fetch('/api/adminboard',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
role:config.title,
discordId:user.id,
name:user.username,
discriminator:user.discriminator,
avatar:user.avatar,
accountCreated:user.created_at,
age:form.age,
email:form.email,
answers
})
})

router.push('/')

}

if(!config) return <div>Role not found</div>

return(

<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-20">

<h1 className="text-4xl font-bold text-center mb-12">
Bewerbung: {config.title}
</h1>

<form
onSubmit={submit}
className="max-w-3xl mx-auto flex flex-col gap-6"
>

<input
name="age"
placeholder="Alter"
onChange={handleChange}
className="p-3 bg-gray-800 rounded-xl"
/>

<input
name="email"
placeholder="Email"
onChange={handleChange}
className="p-3 bg-gray-800 rounded-xl"
/>

{config.fields.map((f:any)=>(
<textarea
key={f.id}
name={f.id}
placeholder={f.label}
onChange={handleChange}
className="p-3 bg-gray-800 rounded-xl"
/>
))}

<button
className="py-3 bg-purple-600 hover:bg-pink-600 rounded-xl"
>
Bewerbung abschicken
</button>

</form>

</div>

)

}
