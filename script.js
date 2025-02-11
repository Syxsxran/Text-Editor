function autoResize(textarea) {
      textarea.style.height = 'auto'; // รีเซ็ตความสูง
      textarea.style.height = textarea.scrollHeight + 'px'; // ตั้งค่าความสูงใหม่
    }

    async function getGPTResponse() {
      const request = document.getElementById('gptRequest').value; // บรีฟการทำงานจากผู้ใช้
      const userInput = document.getElementById('editor').value; // ข้อความจากกล่องข้อความ
      const apiKey = document.getElementById('apiKey').value; // API Key จากกล่องลับ

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}` // ใช้ API Key ที่ผู้ใช้กรอก
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // หรือโมเดลที่คุณต้องการใช้
          messages: [
            { role: "system", content: "You are a response system that helps users with their requests." },
            { role: "user", content: `User request: ${request}\nUser input: ${userInput}` }
          ],
          temperature: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        document.getElementById('gptResponse').value = 'เกิดข้อผิดพลาด: ' + errorData.message;
        return;
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const gptResponse = data.choices[0].message.content;
        document.getElementById('gptResponse').value = gptResponse;
        autoResize(document.getElementById('gptResponse')); // ปรับความสูงของกล่องตอบกลับ
      } else {
        document.getElementById('gptResponse').value = 'ไม่พบผลลัพธ์จาก GPT';
      }
    }
