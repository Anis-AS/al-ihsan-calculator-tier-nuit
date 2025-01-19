import React, { useState, useEffect } from 'react';
import { Clock, Moon, Sun, Share2, Info, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NightCalculator = () => {
  const [maghrebTime, setMaghrebTime] = useState('');
  const [fajrTime, setFajrTime] = useState('');
  const [firstThird, setFirstThird] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [date, setDate] = useState(new Date());
  const [lastCalculations, setLastCalculations] = useState([]);

  useEffect(() => {
    // Charger les derniers calculs du localStorage
    const saved = localStorage.getItem('lastCalculations');
    if (saved) {
      setLastCalculations(JSON.parse(saved));
    }
  }, []);

  const calculateFirstThird = () => {
    if (!maghrebTime || !fajrTime) return;

    const maghrebDate = new Date(`2000/01/01 ${maghrebTime}`);
    let fajrDate = new Date(`2000/01/01 ${fajrTime}`);
    
    if (fajrDate < maghrebDate) {
      fajrDate = new Date(`2000/01/02 ${fajrTime}`);
    }

    const nightDuration = fajrDate - maghrebDate;
    const thirdOfNight = nightDuration / 3;
    const firstThirdTime = new Date(maghrebDate.getTime() + thirdOfNight);

    const result = firstThirdTime.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setFirstThird(result);

    // Sauvegarder le calcul
    const newCalculation = {
      date: new Date().toLocaleDateString('fr-FR'),
      maghreb: maghrebTime,
      fajr: fajrTime,
      firstThird: result
    };

    const updatedCalculations = [newCalculation, ...lastCalculations.slice(0, 4)];
    setLastCalculations(updatedCalculations);
    localStorage.setItem('lastCalculations', JSON.stringify(updatedCalculations));
  };

  const shareResult = async () => {
    const text = `Premier tiers de la nuit - Institut Al-Ihsan\n\nMaghreb : ${maghrebTime}\nFajr : ${fajrTime}\nPremier tiers : ${firstThird}`;
    try {
      await navigator.share({
        title: 'Premier tiers de la nuit',
        text: text
      });
    } catch (error) {
      // Fallback pour copier dans le presse-papier
      navigator.clipboard.writeText(text);
      alert('Résultat copié dans le presse-papier');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-amber-100 to-amber-50 rounded-t-lg border-b border-amber-200">
          <div className="flex flex-col items-center space-y-4">
            <img 
              src="/api/placeholder/200/80" 
              alt="Institut Al-Ihsan"
              className="h-20 object-contain"
            />
            <CardTitle className="text-2xl font-arabic text-gray-800">
              Premier Tiers de la Nuit
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="text-center text-sm text-gray-600">
            {date.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Moon className="w-4 h-4 inline-block mr-2" />
                Heure du Maghreb
              </label>
              <input
                type="time"
                value={maghrebTime}
                onChange={(e) => setMaghrebTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Sun className="w-4 h-4 inline-block mr-2" />
                Heure du Fajr
              </label>
              <input
                type="time"
                value={fajrTime}
                onChange={(e) => setFajrTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <button
              onClick={calculateFirstThird}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-3 px-4 rounded-md hover:from-amber-800 hover:to-amber-700 transition-colors"
            >
              Calculer
            </button>
          </div>

          {firstThird && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Premier tiers de la nuit :</div>
                  <div className="text-2xl font-semibold text-amber-800">{firstThird}</div>
                  <button
                    onClick={shareResult}
                    className="mt-2 text-amber-600 flex items-center justify-center gap-2 w-full"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-gray-600 flex items-center gap-2 text-sm"
            >
              <Info className="w-4 h-4" />
              Qu'est-ce que le premier tiers de la nuit ?
            </button>
            
            {showInfo && (
              <Alert className="mt-2 bg-amber-50">
                <AlertDescription>
                  Le premier tiers de la nuit est la période qui marque le dernier tiers de la première partie de la nuit. 
                  Cette période est considérée comme un moment privilégié pour l'adoration et la prière.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {lastCalculations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Derniers calculs
              </h3>
              <div className="space-y-2">
                {lastCalculations.map((calc, index) => (
                  <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                    {calc.date} : {calc.firstThird}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NightCalculator;
