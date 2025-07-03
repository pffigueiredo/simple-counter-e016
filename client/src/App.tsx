
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { Counter } from '../../server/src/schema';

function App() {
  const [counter, setCounter] = useState<Counter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIncrementing, setIsIncrementing] = useState(false);

  // Load counter data on mount
  const loadCounter = useCallback(async () => {
    try {
      const result = await trpc.getCounter.query();
      setCounter(result);
    } catch (error) {
      console.error('Failed to load counter:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCounter();
  }, [loadCounter]);

  const handleIncrement = async () => {
    if (isIncrementing) return; // Prevent multiple clicks
    
    setIsIncrementing(true);
    try {
      const result = await trpc.incrementCounter.mutate({ amount: 1 });
      setCounter(result);
    } catch (error) {
      console.error('Failed to increment counter:', error);
    } finally {
      setIsIncrementing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading counter...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-96 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            🔢 Simple Counter
          </CardTitle>
          <CardDescription className="text-gray-600">
            Click the button to increment the counter
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            {/* Counter Display */}
            <div className="bg-white rounded-lg p-8 shadow-inner">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {counter?.value || 0}
              </div>
              <div className="text-sm text-gray-500">
                Current Count
              </div>
            </div>

            {/* Increment Button */}
            <Button
              onClick={handleIncrement}
              disabled={isIncrementing}
              className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isIncrementing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Incrementing...
                </>
              ) : (
                <>
                  ➕ Increment Counter
                </>
              )}
            </Button>

            {/* Last Updated */}
            {counter && (
              <div className="text-xs text-gray-400 pt-2">
                Last updated: {counter.updated_at.toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
