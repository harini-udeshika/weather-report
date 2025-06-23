// mcp/WeatherMCP.js
class WeatherMCP {
  constructor() {
    this.context = {
      lastWeatherQuery: null
    };
  }

  async processQuery(userInput) {
    // Process with DeepSeek to extract location
    const response = await this._callDeepSeek(userInput);
    
    // Parse and store the location
    const parsed = this._parseResponse(response);
    
    if (parsed.intent === 'weather_request') {
      this.context.lastWeatherQuery = {
        location: parsed.location,
        timestamp: new Date().toISOString()
      };
    }
    
    return parsed;
  }

  async _callDeepSeek(userInput) {
    const prompt = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `Extract location from weather queries. Respond with JSON containing:
          - intent: 'weather_request' if query is about weather
          - location: extracted location name
          - original_query: the user's original input`
        },
        {
          role: 'user',
          content: userInput
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    };

    const deepSeekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepSeekApiKey}`
      },
      body: JSON.stringify(prompt)
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  _parseResponse(response) {
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse DeepSeek response:', e);
      return {
        intent: 'error',
        message: 'Could not understand the query'
      };
    }
  }
}

export default WeatherMCP;