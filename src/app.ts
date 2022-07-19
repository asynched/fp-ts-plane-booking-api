import express, { json } from 'express'
import router from '@/routes'
import * as planesModule from '@/modules/planes'

const app = express()

planesModule.withRouter(router)

app.use(json())
app.use('/', router)

export default app
