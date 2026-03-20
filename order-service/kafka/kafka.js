
const { Kafka } = require('kafkajs')
const orderSchema = require('../models/orderLog')



const kafka = new Kafka({
    clientId: 'order-service',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
})

const connectKafka = async()=> {

    const producer = kafka.producer()
    const consumer = kafka.consumer({groupId: 'order-service'})

    await producer.connect()
    await consumer.connect()

    await consumer.subscribe({
        topic: 'payment-processed', 
        fromBeginning: true
    })



    await consumer.run({
        eachMessage: async({topic, partition, message}) => {
            const data = JSON.parse(message.value.toString())
            console.log(`Received payment event ${data?.status} for order ${data?.orderId}`)

            const newStatus = data?.status === 'SUCCESS' ? 'PAID' : 'CANCELLED'

            await orderSchema.findByIdAndUpdate(data?.orderId, {status: newStatus}, {new: true})

            console.log(`Order ${data?.orderId} updated to status ${newStatus}`)

        }
    })
}


const sendOrderEvent = async(order)=> {
    await producer.send({
        topic: 'order-created',
        messages: [
            {value: JSON.stringify(order)}
        ]
    })
}

module.exports = { connectKafka, sendOrderEvent }