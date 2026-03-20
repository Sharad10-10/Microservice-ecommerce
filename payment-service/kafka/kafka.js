const { Kafka } = require('kafkajs')
const TransactionSchema = require('../models/transaction')


const kafka = new Kafka({
    clientId: 'payment-service',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
})

const connectKafka = async()=> {

    const producer = kafka.producer()
    const consumer = kafka.consumer({groupId: 'payment-service'})

    await producer.connect()
    await consumer.connect()


    await consumer.subscribe({
        topic: 'order-created',
        fromBeginning: true
    })

   await consumer.run({
    eachMessage: async({topic, partition, message})=> {

        const orderData = JSON.parse(message.value.toString())
        console.log(`Received order event for order ${orderData?.id} with status ${data?.status}`)


        const paymentStatus = orderData?.totalAmount > 0 ? 'SUCCESS' : 'FAILED'

        const transaction = new TransactionSchema({
            orderId: orderData?._id,
            amount: orderData?.totalAmount,
            status: paymentStatus
        })
        await transaction.save()
        console.log('Transaction saved with status', paymentStatus)
        

        await producer.send({
            topic: 'payment-processed',
            messages: {
                value: JSON.stringify({
                    orderId: orderData?._id,
                    status: paymentStatus,
                    amount: orderData?.totalAmount
                })
            }
        })

    }
   })


}

module.exports = { connectKafka }