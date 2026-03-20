const { Kafka } = require('kafkajs')
const { Resend } = require('resend')
const EmailLog = require('../models/emailLog')
const dotenv = require('dotenv')

dotenv.config()



const kafka = new Kafka({
    clientId: 'email-service',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
})

const resend = new Resend(process.env.RESEND_API_KEY)


const connectKafka = async()=> {
    const producer = kafka.producer()
    await producer.connect()
    const consumer = kafka.consumer({groupId: 'email-service'})
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
        topic: 'user-created',
        fromBeginning: true
    })

    await consumer.run({
        eachMessage: async({topic, partition, message})=> {
          try {
            const eventData = JSON.parse(message.value.toString())

            // console.log(`Email service received event ${topic} with data`, eventData)
        
            switch (topic) {
                case 'order-created':
                    await sendOrderConfirmationEmail(eventData)
                    break
                case 'payment-processed':
                    await sendPaymentStatusEmail(eventData)
                    break
                case 'user-created':
                    await sendUserCreatedEmail(eventData)
                    break
                default:
                    console.log('Unknown event type', topic)
            }

          } catch (error) {
            console.log('Error processing event data')
          }

        }

    })


}


const sendOrderConfirmationEmail = async(orderData)=> {

    try {
        
        const recipient = orderData?.customerEmail || 'default@example.com'
        const subject = `Order Confirmation - Order #${orderData?.orderId || orderData?._id}`
        const html = `<p>Thank you for your order! Your order has been placed and your order ID is <strong>${orderData?.orderId || orderData?._id}</strong>.</p><p>Total Amount: <strong>$${orderData?.totalAmount}</strong></p>`

        let emailStatus = 'SENT'

        try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: recipient,
                    subject,
                    html
                })


        } catch (error) {
            console.log(error)
        }

        const emailLog = new EmailLog ({
            recipient,
            subject,
            body: html,
            status: emailStatus,
            eventType: 'order-created',
        })

        await emailLog.save()

        if(emailStatus === 'SENT') {
            await producer.send({
                topic: 'email-successful',
                messages: {
                    value: JSON.stringify({
                        orderId: orderData?._id,
                        eventType: 'order-created',
                        recipient
                    })
                }
            })
        }



    } catch (error) {
        console.log(error)
    }

}
const sendPaymentStatusEmail = async(paymentData)=> {

    try {
        
        const recipient = paymentData?.customerEmail || 'default@example.com'
        const subject = `Payment Update - Order #${paymentData?.orderId}`
        const status = paymentData?.status === 'SUCCESS' ? 'Payment Successful' : 'Payment Failed'
        const html = `<p>Thank you for your payment! Your payment has been processed.</p><p>Total Amount: <strong>$${paymentData?.totalAmount}</strong></p>`

        let emailStatus = 'SENT'

        try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: recipient,
                    subject,
                    html
                })


        } catch (error) {
            console.log(error)
        }

        const emailLog = new EmailLog ({
            recipient,
            subject,
            body: html,
            status: emailStatus,
            eventType: 'payment-processed',
        })

        await emailLog.save()

        if(emailStatus === 'SENT') {
            await producer.send({
                topic: 'email-successful',
                messages: {
                    value: JSON.stringify({
                        orderId: paymentData?.orderId,
                        eventType: 'payment-processed',
                        recipient
                    })
                }
            })
        }
        

    } catch (error) {
        console.log(error)
    }

}

const sendUserCreatedEmail = async(userData)=> {


    try{

        const verifyLink = `http://localhost:3000/verify-email/${userData?.verificationToken}`

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: userData?.email,
            subject: "Verify your email",
            html: `
              <h2>Email Verification</h2>
              <p>Click below to verify your email</p>
              <a href="${verifyLink}">Verify Email</a>
            `
          })


    }

    catch(error){
        console.log(error)
    }



}



module.exports = { connectKafka }

 