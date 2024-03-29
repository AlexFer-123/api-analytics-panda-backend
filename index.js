const express = require('express')
const axios = require('axios')
const circularJSON = require('circular-json')
const cors = require('cors')
const app  = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.post('/', async (req, res) => {
        const { start_date, end_date, api_key } = req.body
        const videosData = []


        const config = {
            headers: {
                Authorization: api_key
            }
        }
    
        const responseVideos = await axios.get('https://api-v2.pandavideo.com.br/videos', config)
        
        for (let i = 0; i < responseVideos.data.videos.length; i++) {

            try {
                const video_id = responseVideos.data.videos[i].id
                const video_title = responseVideos.data.videos[i].title
                const configPanda = {
                    headers: {
                        Authorization: api_key
                    },
                    body: {
                        video_id,
                        start_date,
                        end_date
                    }
                }
    
                const analyticsVideoData = await axios.get(`https://data.pandavideo.com/general/${video_id}`, configPanda)
                
                videosData.push({video_id, video_title, views: circularJSON.stringify(analyticsVideoData.data.total)}) 
            } catch (error) {
                console.log(error)
            }
        }

        return res.send(circularJSON.stringify(videosData))
})

app.post('/analytics', async (req, res) => {
    const { start_date, end_date, api_key } = req.body

    console.log(start_date, end_date, api_key)

    const config = {
        headers: {
            Authorization: api_key
        },
        body: {
            start_date,
            end_date
        }
    }

    const responseAnalytics = await axios.get('https://data.pandavideo.com/general', config)

    return res.send(circularJSON.stringify(responseAnalytics.data))
})


app.listen(port)