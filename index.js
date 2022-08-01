const express=require('express');
const cors=require('cors');

const app=express();


app.use(express.static('build'));
app.use(cors());
app.use(express.json());

const phoneBook=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];
app.get('/info',(request,response)=>{
    response.send(`
    <p>Phonebook has info for ${phoneBook.length} people</p>
    <p>${new Date()}</p>
    `)
})
app.get('/api/persons',(request,response)=>{
    response.send(phoneBook);
});
app.post('/api/persons',(request,response)=>{
  const updatedPhoneObj={id:phoneBook.length+1,...request.body}
  phoneBook.concat([updatedPhoneObj]);
  response.send(updatedPhoneObj);
})
app.get('/api/persons/:id',(request,response)=>{
  const personId=parseInt(request.params.id,10);
  let selectedPerson=[];
  if(personId && typeof personId==='number'){
    selectedPerson=phoneBook.filter((entry)=>{
      return personId===entry.id;
    });
    if(selectedPerson.length){
      return response.send(selectedPerson);
    }
    return response.status(400).send({error:"Person does not exist"})
  }
  return response.status(400).send({error:"Invalid input"})
});
app.delete('/api/persons/:id',(request,response)=>{
  const personId=parseInt(request.params.id,10);
  if(personId && typeof personId==='number'){
    const selectedPerson=phoneBook.findIndex((entry)=>{
      return personId===entry.id;
    });
    if(selectedPerson>-1){
      phoneBook.splice(selectedPerson,1);
      return response.status(204).end();
    }
    return response.status(400).send({error:"Person does not exist"})
  }
  return response.status(400).send({error:"Invalid input"})
});
app.put('/api/persons/:id',(request,response)=>{
  const personId=parseInt(request.params.id,10);
  const newPhoneNumber=request.body.number;
  let selectedPhone;
  if(personId && typeof personId === 'number'){
    phoneBook.forEach((phone)=>{
      if(phone.id === personId){
        phone.number=newPhoneNumber;
        selectedPhone=phone;
      }
      return phone;
    });
  }
  response.send(selectedPhone);
})
app.get('/',(request,response)=>{
    response.redirect('/api/persons');
});
const port=3001;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})