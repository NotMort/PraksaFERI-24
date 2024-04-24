import { NestFactory } from '@nestjs/core'

import { AppModule } from './modules/app.module'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import express  from 'express'
import Logging from 'library/Logging'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  })
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials:true
  })
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  
  app.use('/files',express.static('files'))

  //set up swager
  const config = new DocumentBuilder()
    .setTitle('NestJS Tutorial API')
    .setDescription('Tis is api for NestJs')
    .setVersion('1.0.0')
    .build()
  
  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('/',app,document)

  const PORT = process.env.PORT || 8080
  await app.listen(PORT)
  Logging.log(`App is listening on: ${await app.getUrl()}`)
}
bootstrap()
