import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const Todo = () => {
  const queryClient = useQueryClient();

  const { userId, groupId } = useParams();
  console.log(userId);
  console.log(groupId);

  const [formdata, setFormdata] = useState({
    label: '',
    description: '',
    id: ''
  });

  const [tempstore, setTempstore] = useState();

  const [update, setUpdate] = useState(false);
  const [checkedstate, setCheckedstate] = useState({});
  const createTodo = async () => {
    try {
      const response = await axios.post('http://localhost:3000/usertodo/createtodo', {
        label: formdata.label,
        description: formdata.description,
        groupId: groupId,
        userId: userId,
      });
      return response.data;
      console.log(response.data);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new Error('Failed to create todo');
    }
  };

  const fetchall = async () => {
    try {
      const response = await axios.post('http://localhost:3000/usertodo/getusergroup', {
        userId: userId,
        groupId: groupId,
      });
      return response.data.todos;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch todos');
    }
  };


  const deletefn = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/usertodo/deletetodo/${id}`)
      return response.data;
    }
    catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to delete todos');
    }

  }

  const updatefn = async () => {

    try {
      const response = await axios.post(`http://localhost:3000/usertodo/updateTodo/${tempstore}`, {
        label: formdata.label,
        description: formdata.description
      });
      setFormdata({
        label: '',
        description: ''
      })
      return response.data;

    }
    catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch todos');
    }
  }

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todolist'] });
      setFormdata({ label: '', description: '' });
    },
    onError: (error) => {
      console.error('Error creating todo:', error);
    },
  });

  const { data: todoData, error: todoError, isLoading: todoLoading } = useQuery({
    queryKey: ['todolist'],
    queryFn: fetchall,
  });


  const updatemutation = useMutation({
    mutationFn: updatefn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todolist"] });
      setUpdate(false);
    },
    onError: (error) => {
      console.error('Error creating todo:', error);
    },
  })

  // const{data:todoData,error:todoError,isLoading:todoLoading}=useQuery({
  //   queryKey:['todoList'],
  //   queryFn:
  // })
  const deleteMutation = useMutation({
    mutationFn: (id) => deletefn(id), // Pass `id` as an argument to the `deletefn` function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todolist'] }); // Invalidate queries to refresh data
    },
    onError: (error) => {
      console.error('Error deleting todo:', error); // Handle errors
    },
  });



  const handledelete = (todoId) => {

    deleteMutation.mutate(todoId);
  }



  const handlecheckbox = (label) => {
    setCheckedstate((prevState) => ({
      ...prevState,
      [label]: !prevState[label], // Toggle the checked state for this label
    }));
    localStorage.setItem('checkeditems', JSON.stringify(checkedstate))
  };



  const handlechange = (e) => {
    setFormdata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (formdata.label.trim() !== '' && formdata.description.trim() !== '') {

      if (update) {
        try {

          const updatedData = { ...formdata };
          updatemutation.mutate(updatedData);
        } catch (error) {
          console.error('Update Error:', error);
        }
      } else {
        mutation.mutate(formdata);
      }
    }
  };



  const handleUpdate = async (todoId, updlabel, upddesc) => {
    setUpdate(true);
    // const response=await axios.post(`http://localhost:3000/usertodo/updateTodo/${todoId}`,{
    //   label:updlabel,
    //   description:upddesc
    // })
    // return response.data
    setTempstore(todoId);
    setFormdata({
      label: updlabel,
      description: upddesc,
      id: todoId
    })
  }

  if (todoError) {
    return <p>Error...</p>;
  }

  if (todoLoading) {
    return <p>Data is loading...</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="text"
          className="inputfortodo form-control"
          style={{ marginRight: '40px' }}
          name="label"
          value={formdata.label || ""}
          placeholder='Enter your label...'
          onChange={handlechange}
        />


        <input
          style={{ marginRight: '40px' }}
          className="inputfortodo form-control"
          type="text"
          name="description" // Corrected to lowercase
          value={formdata.description}
          placeholder='Enter your description...'
          onChange={handlechange}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className='todo-submit' onClick={handlesubmit}>Submit</button>
      </div>


      {todoData && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead className='table-head'>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: '600' }}>Label</th>
              <th style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: '600' }}>Description</th>
              <th style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: '600' }}>Created Time</th>
              <th style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: '600' }}>Updated Time</th>
              <th style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((ind) => (
              <tr key={ind.id}>
                <td style={{ border: "1px solid black", padding: "8px", fontSize: "18px",width:'300px' }}>
                  <input
                    type="checkbox"
                    checked={checkedstate[ind.label] || false}
                    onChange={() => handlecheckbox(ind.label)}
                    style={{ marginRight: "10px" }}
                  />
                  <span
                    style={{
                      textDecoration: checkedstate[ind.label] ? "line-through" : "none",
                    }}
                  >
                    {ind.label}
                  </span>
                </td>
                <td style={{ border: "1px solid black", padding: "8px", fontSize: "16px",width:'300px'  }}>
                  {ind.description}
                </td>
                <td style={{ border: "1px solid black", padding: "8px", textAlign: "left",width:'300px'  }}>
                  {ind.created_time}
                </td>
                <td style={{ border: "1px solid black", padding: "8px", textAlign: "left",width:'300px'  }}>
                  {ind.updated_time}
                </td>
                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>
                  <button
                  className='todo-submit'
                    style={{ marginRight: "20px" }}
                    onClick={() => handleUpdate(ind._id, ind.label, ind.description)}
                  >
                    Update
                  </button>
                  <button className='todo-submit' onClick={() => handledelete(ind._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}








    </div>
  );
};

export default Todo;
