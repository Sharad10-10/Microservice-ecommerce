const {Kafka} = require('kafkajs')


const kafka = new Kafka({
    clientId: 'auth service',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
})

const producer = kafka.producer()

const connectKafka = async () => {
  await producer.connect()
  console.log("Kafka connected for auth service")
}


const sendNewUserEvent = async(user)=> {

    console.log('USer here :',user)

    await producer.send({
        topic: 'user-created',
        messages: [{
            value: JSON.stringify(user)
        }]

    })

}

module.exports = { connectKafka, sendNewUserEvent }