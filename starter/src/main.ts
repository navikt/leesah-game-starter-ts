import { Kafka, Partitioners } from "kafkajs"

interface Category {
    theme: string
    question: string
}

console.log('\n========== ⚡ BOOTING UP ⚡ =========== \n')

async function boot() {
    try {
        const host = process.env.HOST_IP

        const kafka = new Kafka({
            clientId: 'leesah-game-starter-js',
            brokers: [`${host}:9092`]
        })

        const topic = 'topic-test'
        const consumer = kafka.consumer({ groupId: 'test-group' })
        
        await consumer.connect()
        await consumer.subscribe({ topic, fromBeginning: true })

        await consumer.run({
            eachMessage: async ({ message }) => {
                if (message.value) {
                    const messageCategory: Category = JSON.parse(message.value?.toString())
                    console.log(messageCategory)
                }
            },
          })

    } catch(error) {
        console.log('\n\n=========== 💥  TERROR 💥  ============\n\n')
        console.log(error)
    }
}

void boot()