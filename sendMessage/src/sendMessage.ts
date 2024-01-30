import { Kafka, Partitioners } from "kafkajs";

interface Category {
    theme: string
    question: string
}

async function sendMessageToTopic() {

    const host = process.env.HOST_IP
    
    const kafka = new Kafka({
        clientId: 'leesah-game-starter-js',
        brokers: [`${host}:9092`]
    })
    
    const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })

    await producer.connect()

    const testCategory: Category = {
        theme: 'Leesah!!',
        question: 'Hvorfor er leesah så kult?'
    }

    await producer.send({topic: 'topic-test', messages: [{value: JSON.stringify(testCategory)}]})

    process.exit(1)
}    

sendMessageToTopic()
