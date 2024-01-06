const express = require('express')
const axios = require('axios')
const circularJSON = require('circular-json')
const app  = express()
const port = 3000

app.get('/', async (req, res) => {
    try {
        const videoIds = []
        const dateStart = '2023-12-01'
        const dateEnd = '2023-12-31'

        const config = {
            headers: {
                Authorization: 'panda-ee764cc77fd0825d8005de3e82848fef259a03047c2d2d42b25fda0f9780d3fb'
            }
        }
    
        const responseVideos = await axios.get('https://api-v2.pandavideo.com.br/videos', config)
        
        for (let i = 0; i < responseVideos.data.videos.length; i++) {
            videoIds.push(responseVideos.data.videos[i].id)
        }



        res.send(videoIds)
    } catch (error) {
        
        console.log(error)
        res.status(500).send(error)

    }
})

app.get('/analytics', async (req, res) => {
    const { start_date, end_date } = req

    console.log(start_date, end_date)

    const reqBody = circularJSON.stringify(req.body)
    return res.send(reqBody)

})


app.listen(port)