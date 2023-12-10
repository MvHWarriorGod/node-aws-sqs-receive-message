const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const getQueueUrl = async (queueName) => {
  const params = {
    QueueName: queueName,
  };
  const data = await sqs.getQueueUrl(params).promise();
  return data.QueueUrl;
};

const receiveMessage = async () => {
  const queueName = "queuetest";
  const queueUrl = await getQueueUrl(queueName);

  const receiveMessageParams = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 30,
    WaitTimeSeconds: 20,
  };

  try {
    // Recibir mensaje de la cola
    const data = await sqs.receiveMessage(receiveMessageParams).promise();

    if (data.Messages && data.Messages.length > 0) {
      const message = data.Messages[0];

      console.log("Mensaje recibido =>", message.Body);

      // Eliminar mensaje de la cola después de procesarlo
      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      };
      await sqs.deleteMessage(deleteParams).promise();
    }
  } catch (error) {
    console.log("Hubo un error en recepcionar el mensaje =>", error);
  }

  // Continuamos sondeando
  receiveMessage();
};

module.exports = { receiveMessage };
