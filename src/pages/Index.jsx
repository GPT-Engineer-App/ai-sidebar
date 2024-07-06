import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [selectedService, setSelectedService] = useState("ChatGPT");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleToggleService = () => {
    setSelectedService((prev) => (prev === "ChatGPT" ? "Claude.ai" : "ChatGPT"));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/${selectedService.toLowerCase()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("An error occurred while fetching the response.");
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{selectedService}</span>
            <Button onClick={handleToggleService}>
              Switch to {selectedService === "ChatGPT" ? "Claude.ai" : "ChatGPT"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="Type your query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={handleSubmit}>Submit</Button>
            {response && (
              <div className="mt-4 p-4 border rounded">
                <strong>Response:</strong>
                <p>{response}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;