const { Kafka } = require('kafkajs')
const EventLogSchema = require('../models/eventLog')


const kafka = new Kafka({
    clientId: 'analytic-service',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
})

const connectKafka = async()=> {

    const consumer = kafka.consumer({groupId: 'analytic-service'})
    await consumer.connect()

     await consumer.subscribe({
        topic: 'order-created',
        fromBeginning: true
     })

     await consumer.subscribe({
        topic: 'payment-processed',
        fromBeginning: true
     })

     await consumer.subscribe({
        topic: 'email-successful',
        fromBeginning: true
     })

     await consumer.run({
        eachMessage: async({topic, partition, message})=> {
            const data = JSON.parse(message.value.toString())
            console.log('Analytic event received', topic, data)
        
            const eventLog = new EventLogSchema({
                eventType: topic,
                payload: data
            })
            await eventLog.save()
        }
     })

}


module.exports = { connectKafka }