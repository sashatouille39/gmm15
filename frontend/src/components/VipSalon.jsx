import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Crown, 
  Users, 
  Star, 
  ShoppingCart,
  Trophy,
  DollarSign,
  Skull,
  Zap,
  MessageCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { MOCK_CELEBRITIES } from '../mock/mockData';
import { vipService } from '../services/vipService';

const VipSalon = ({ gameState, updateGameState }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('salon');
  const [selectedCelebrity, setSelectedCelebrity] = useState(null);

  const salonUpgrades = [
    { 
      level: 1, 
      name: 'Salon Basique', 
      capacity: 3, 
      cost: 0, 
      description: 'Salon d\'entrée avec 3 places VIP',
      unlocked: true 
    },
    { 
      level: 2, 
      name: 'Salon Confort', 
      capacity: 5, 
      cost: 15000000, // 15 millions
      description: 'Meilleur confort, 5 places VIP',
      unlocked: gameState.money >= 15000000
    },
    { 
      level: 3, 
      name: 'Salon Luxe', 
      capacity: 8, 
      cost: 35000000, // 35 millions
      description: 'Salon de luxe avec bar, 8 places VIP',
      unlocked: gameState.money >= 35000000 && gameState.vipSalonLevel >= 2 
    },
    { 
      level: 4, 
      name: 'Salon Impérial', 
      capacity: 12, 
      cost: 75000000, // 75 millions
      description: 'Prestige maximum, 12 places VIP',
      unlocked: gameState.money >= 75000000 && gameState.vipSalonLevel >= 3 
    }
  ];

  const purchaseCelebrity = (celebrity) => {
    if (gameState.money >= celebrity.price) {
      updateGameState({
        money: gameState.money - celebrity.price,
        ownedCelebrities: [...(gameState.ownedCelebrities || []), celebrity.id]
      });
    }
  };

  const upgradeSalon = (level) => {
    const upgrade = salonUpgrades.find(s => s.level === level);
    if (upgrade && gameState.money >= upgrade.cost && upgrade.unlocked) {
      updateGameState({
        money: gameState.money - upgrade.cost,
        vipSalonLevel: level
      });
    }
  };

  const currentSalon = salonUpgrades.find(s => s.level === gameState.vipSalonLevel);
  const ownedCelebrities = MOCK_CELEBRITIES.filter(c => 
    gameState.ownedCelebrities?.includes(c.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-black text-white">Salon VIP</h1>
              <p className="text-gray-400">Gérez vos VIP et célébrités</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">${gameState.money.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Budget disponible</div>
          </div>
        </div>

        {/* Statut du salon actuel */}
        <Card className="bg-black/50 border-yellow-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Crown className="w-12 h-12 text-yellow-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentSalon?.name}</h2>
                  <p className="text-gray-400">{currentSalon?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-yellow-400">{currentSalon?.capacity}</div>
                <div className="text-sm text-gray-400">Places VIP</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-black/50 border border-red-500/30">
            <TabsTrigger value="salon" className="data-[state=active]:bg-red-600">
              <Crown className="w-4 h-4 mr-2" />
              Salon
            </TabsTrigger>
            <TabsTrigger value="vips" className="data-[state=active]:bg-red-600">
              <Users className="w-4 h-4 mr-2" />
              VIP
            </TabsTrigger>
            <TabsTrigger value="celebrities" className="data-[state=active]:bg-red-600">
              <Star className="w-4 h-4 mr-2" />
              Célébrités
            </TabsTrigger>
            <TabsTrigger value="museum" className="data-[state=active]:bg-red-600">
              <Skull className="w-4 h-4 mr-2" />
              Musée des morts
            </TabsTrigger>
          </TabsList>

          {/* Gestion du salon */}
          <TabsContent value="salon" className="space-y-6">
            <Card className="bg-black/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white">Améliorations du salon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {salonUpgrades.map((upgrade) => (
                    <div
                      key={upgrade.level}
                      className={`p-6 rounded-lg border transition-all ${
                        gameState.vipSalonLevel === upgrade.level
                          ? 'bg-yellow-900/20 border-yellow-500/50'
                          : upgrade.unlocked
                          ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                          : 'bg-gray-900/50 border-gray-700/30 opacity-60'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">{upgrade.name}</h3>
                          <p className="text-gray-400 text-sm">{upgrade.description}</p>
                        </div>
                        {gameState.vipSalonLevel === upgrade.level && (
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                            Actuel
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Capacité VIP:</span>
                          <span className="text-white font-medium">{upgrade.capacity} places</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Coût:</span>
                          <span className={`font-bold ${upgrade.cost === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {upgrade.cost === 0 ? 'Gratuit' : `$${upgrade.cost.toLocaleString()}`}
                          </span>
                        </div>

                        {gameState.vipSalonLevel < upgrade.level && (
                          <Button
                            onClick={() => upgradeSalon(upgrade.level)}
                            disabled={!upgrade.unlocked || gameState.money < upgrade.cost}
                            className={`w-full ${
                              upgrade.unlocked && gameState.money >= upgrade.cost
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-gray-600 cursor-not-allowed'
                            }`}
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            {!upgrade.unlocked ? 'Prérequis manquants' : 'Améliorer'}
                          </Button>
                        )}
                      </div>

                      {/* Barre de progression vers le niveau suivant */}
                      {gameState.vipSalonLevel === upgrade.level && upgrade.level < 4 && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <div className="text-sm text-gray-400 mb-2">
                            Prochain niveau: {salonUpgrades[upgrade.level]?.name}
                          </div>
                          <Progress 
                            value={Math.min(100, (gameState.money / salonUpgrades[upgrade.level]?.cost) * 100)} 
                            className="h-2" 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des VIP */}
          <TabsContent value="vips" className="space-y-6">
            <Card className="bg-black/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  VIP Permanents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {VIP_CHARACTERS.map((vip) => (
                    <Card key={vip.id} className="bg-gray-800/50 border-gray-600/30">
                      <CardContent className="p-6 text-center">
                        <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl">🎭</span>
                        </div>
                        <h3 className="text-white font-bold mb-2">{vip.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={`mb-4 ${
                            vip.personality === 'absurde' ? 'text-purple-400 border-purple-400' :
                            vip.personality === 'raffiné' ? 'text-blue-400 border-blue-400' :
                            'text-green-400 border-green-400'
                          }`}
                        >
                          {vip.personality}
                        </Badge>
                        
                        {/* Dialogue récent */}
                        <div className="bg-gray-700/50 p-3 rounded-lg mb-4">
                          <MessageCircle className="w-4 h-4 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-300 italic">
                            "{vip.dialogues[Math.floor(Math.random() * vip.dialogues.length)]}"
                          </p>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Mises totales:</span>
                            <span className="text-white">${(Math.random() * 50000).toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Victoires:</span>
                            <span className="text-green-400">{Math.floor(Math.random() * 10)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Boutique de célébrités */}
          <TabsContent value="celebrities" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Boutique de célébrités</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {ownedCelebrities.length} possédées
                </Badge>
                <Badge variant="outline" className="text-gray-400">
                  {MOCK_CELEBRITIES.length} disponibles
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_CELEBRITIES.map((celebrity) => {
                const isOwned = gameState.ownedCelebrities?.includes(celebrity.id);
                
                return (
                  <Card 
                    key={celebrity.id} 
                    className={`transition-all cursor-pointer ${
                      isOwned 
                        ? 'bg-green-900/20 border-green-500/30' 
                        : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedCelebrity(celebrity)}
                  >
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Star className="w-8 h-8 text-yellow-400" />
                        </div>
                        <h3 className="text-white font-bold">{celebrity.name}</h3>
                        <p className="text-gray-400 text-sm">{celebrity.category}</p>
                      </div>

                      <div className="space-y-2 mb-4">
                        {/* Étoiles */}
                        <div className="flex justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < celebrity.stars ? 'text-yellow-400 fill-current' : 'text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Intel:</span>
                            <span className="text-white">{celebrity.stats.intelligence}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Force:</span>
                            <span className="text-white">{celebrity.stats.force}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Agilité:</span>
                            <span className="text-white">{celebrity.stats.agilité}/10</span>
                          </div>
                        </div>

                        {celebrity.wins && (
                          <div className="flex justify-center">
                            <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">
                              {celebrity.wins} victoires
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        {isOwned ? (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            Possédée
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-yellow-400 font-bold">
                              ${celebrity.price.toLocaleString()}
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                purchaseCelebrity(celebrity);
                              }}
                              disabled={gameState.money < celebrity.price}
                              className={`w-full text-xs ${
                                gameState.money >= celebrity.price
                                  ? 'bg-red-600 hover:bg-red-700'
                                  : 'bg-gray-600 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Acheter
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Musée des morts */}
          <TabsContent value="museum" className="space-y-6">
            <Card className="bg-black/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Skull className="w-5 h-5" />
                  Musée des morts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-400">
                  <Skull className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">Bientôt disponible</h3>
                  <p>Les portraits des joueurs éliminés seront exposés ici</p>
                  <p className="text-sm mt-2">Organisez votre premier jeu pour commencer la collection</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal détails célébrité */}
        {selectedCelebrity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-gray-900 border-red-500/30 max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  {selectedCelebrity.name}
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedCelebrity(null)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Star className="w-10 h-10 text-yellow-400" />
                  </div>
                  <Badge variant="outline" className="text-gray-300">
                    {selectedCelebrity.nationality}
                  </Badge>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Biographie</h4>
                  <p className="text-gray-300 text-sm">{selectedCelebrity.biography}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-800/30 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{selectedCelebrity.stats.intelligence}</div>
                    <div className="text-xs text-gray-400">Intelligence</div>
                  </div>
                  <div className="bg-gray-800/30 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">{selectedCelebrity.stats.force}</div>
                    <div className="text-xs text-gray-400">Force</div>
                  </div>
                  <div className="bg-gray-800/30 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{selectedCelebrity.stats.agilité}</div>
                    <div className="text-xs text-gray-400">Agilité</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default VipSalon;