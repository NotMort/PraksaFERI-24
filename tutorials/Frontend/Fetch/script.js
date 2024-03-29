fetch('url',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'user'
    })
})
.then(res => {
    if (res.ok)
    { console.lg('ok')}
    else{
        console.log('not')
    }
    res.json()})
.then(data => console.log(data))
.catch(error => console.log('Error'))