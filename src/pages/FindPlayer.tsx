
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    ArrowLeft,
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    User,
    ChevronRight,
    Search,
    Plus,
    MessageSquare,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { sports } from '@/data/venues';
import { PremiumBottomNav } from '@/components/premium';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PlayerGame {
    id: string;
    hostName: string;
    sport: string;
    location: string;
    city: string;
    date: string;
    timeSlot: string;
    skillLevel: string;
    slotsNeeded: number;
    status: 'Looking' | 'Almost Full';
    joinedPlayersCount: number;
    totalPlayersNeeded: number;
}

const MOCK_PLAYER_GAMES: PlayerGame[] = [
    {
        id: '1',
        hostName: 'Rahul S.',
        sport: 'Badminton',
        location: 'PowerPlay Arena',
        city: 'Bangalore',
        date: format(new Date(), 'yyyy-MM-dd'),
        timeSlot: '18:00 - 19:00',
        skillLevel: 'Intermediate',
        slotsNeeded: 2,
        status: 'Looking',
        joinedPlayersCount: 2,
        totalPlayersNeeded: 4
    },
    {
        id: '2',
        hostName: 'Amit K.',
        sport: 'Football',
        location: 'Goal Rush Turf',
        city: 'Bangalore',
        date: format(new Date(), 'yyyy-MM-dd'),
        timeSlot: '19:00 - 20:00',
        skillLevel: 'Advanced',
        slotsNeeded: 1,
        status: 'Almost Full',
        joinedPlayersCount: 9,
        totalPlayersNeeded: 10
    },
    {
        id: '3',
        hostName: 'Sneha M.',
        sport: 'Tennis',
        location: 'Ace Academy',
        city: 'Kolkata',
        date: format(new Date(), 'yyyy-MM-dd'),
        timeSlot: '07:00 - 08:00',
        skillLevel: 'Beginner',
        slotsNeeded: 1,
        status: 'Looking',
        joinedPlayersCount: 1,
        totalPlayersNeeded: 2
    }
];

const FindPlayer = () => {
    const navigate = useNavigate();
    const { user, demoUser } = useAuth();
    const [view, setView] = useState<'search' | 'results' | 'create'>('search');

    // Search Filters
    const [selectedSport, setSelectedSport] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState(localStorage.getItem('venue-vibes-location') || 'Kolkata');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTimeRange, setSelectedTimeRange] = useState<string>('any');
    const [selectedSkill, setSelectedSkill] = useState<string>('any');
    const [playerCount, setPlayerCount] = useState<string>('1');

    // Requests state (mocking persistence)
    const [requests, setRequests] = useState<Record<string, 'pending' | 'accepted' | 'rejected'>>({});

    const isSearchDisabled = !selectedSport || !selectedCity || !selectedDate;

    const handleSearch = () => {
        if (isSearchDisabled) return;
        setView('results');
    };

    const handleJoinRequest = (gameId: string) => {
        setRequests(prev => ({ ...prev, [gameId]: 'pending' }));
        toast.success("Request sent to host!", {
            description: "You'll be notified once they accept.",
            icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
        });
    };

    const filteredGames = useMemo(() => {
        return MOCK_PLAYER_GAMES.filter(game => {
            const matchSport = game.sport === selectedSport;
            const matchCity = game.city === selectedCity;
            // Simplified date and time filter for demo
            return matchSport && matchCity;
        });
    }, [selectedSport, selectedCity, view]);

    const handleBack = () => {
        if (view === 'results') setView('search');
        else if (view === 'create') setView('search');
        else navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative pb-28">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="px-4 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Find a Player</h1>
                    <div className="flex-1" />
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-primary text-primary font-medium"
                        onClick={() => setView('create')}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Create
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 animate-fade-in">
                {view === 'search' && (
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Search className="w-5 h-5 text-primary" />
                                Search Games
                            </h2>

                            {/* Sport Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Sport *</label>
                                <Select onValueChange={setSelectedSport} value={selectedSport}>
                                    <SelectTrigger className="w-full bg-gray-50 border-none rounded-xl h-12">
                                        <SelectValue placeholder="Select Sport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sports.filter(s => s !== 'All Sports').map(sport => (
                                            <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Location Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Location *</label>
                                <Select onValueChange={setSelectedCity} value={selectedCity}>
                                    <SelectTrigger className="w-full bg-gray-50 border-none rounded-xl h-12">
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                                        <SelectItem value="Kolkata">Kolkata</SelectItem>
                                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Selector */}
                            <div className="space-y-2 flex flex-col">
                                <label className="text-sm font-semibold text-gray-700">Date *</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-gray-50 border-none rounded-xl h-12",
                                                !selectedDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Time Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Time Range</label>
                                <Select onValueChange={setSelectedTimeRange} value={selectedTimeRange}>
                                    <SelectTrigger className="w-full bg-gray-50 border-none rounded-xl h-12">
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any Time</SelectItem>
                                        <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                                        <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                                        <SelectItem value="evening">Evening (5 PM - 10 PM)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Skill Level */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Skill Level</label>
                                    <Select onValueChange={setSelectedSkill} value={selectedSkill}>
                                        <SelectTrigger className="w-full bg-gray-50 border-none rounded-xl h-12 text-xs">
                                            <SelectValue placeholder="Skill" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any</SelectItem>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Player Count */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Needed</label>
                                    <Select onValueChange={setPlayerCount} value={playerCount}>
                                        <SelectTrigger className="w-full bg-gray-50 border-none rounded-xl h-12 text-xs">
                                            <SelectValue placeholder="Count" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 Player</SelectItem>
                                            <SelectItem value="2">2 Players</SelectItem>
                                            <SelectItem value="3">3 Players</SelectItem>
                                            <SelectItem value="4">4+ Players</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 mt-4"
                                disabled={isSearchDisabled}
                                onClick={handleSearch}
                            >
                                Find Players
                            </Button>
                        </div>

                        {/* Secondary CTA */}
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">Can't find a game?</p>
                            <Button variant="link" className="text-primary font-bold h-auto p-0" onClick={() => setView('create')}>
                                Create your own game session
                            </Button>
                        </div>
                    </div>
                )}

                {view === 'results' && (
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold text-gray-900">{filteredGames.length} Games found</h2>
                            <Button variant="ghost" size="sm" onClick={() => setView('search')} className="text-primary text-xs font-semibold">
                                Filter
                            </Button>
                        </div>

                        {filteredGames.length > 0 ? (
                            filteredGames.map((game) => (
                                <Card key={game.id} className="overflow-hidden border-none shadow-sm rounded-3xl hover:shadow-md transition-all">
                                    <CardContent className="p-0">
                                        <div className="p-5 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{game.hostName}</h3>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-[10px] px-2">
                                                                {game.sport}
                                                            </Badge>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="flex items-center gap-0.5">
                                                                {game.skillLevel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge className={cn(
                                                    "rounded-full px-3 py-1 text-[10px] font-bold border-none",
                                                    game.status === 'Almost Full' ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                                                )}>
                                                    {game.status}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 py-2 border-y border-gray-50">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                                    {format(new Date(game.date), 'MMM dd')}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    {game.timeSlot}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                    {game.location}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Users className="w-3.5 h-3.5 text-gray-400" />
                                                    {game.joinedPlayersCount}/{game.totalPlayersNeeded} joined
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    className="flex-1 rounded-xl font-bold transition-all active:scale-95"
                                                    variant={requests[game.id] === 'pending' ? "secondary" : "default"}
                                                    disabled={requests[game.id] === 'pending'}
                                                    onClick={() => handleJoinRequest(game.id)}
                                                >
                                                    {requests[game.id] === 'pending' ? 'Pending...' : 'Request to Join'}
                                                </Button>
                                                <Button variant="outline" size="icon" className="rounded-xl w-12 h-12">
                                                    <MessageSquare className="w-5 h-5 text-gray-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 px-6 bg-white rounded-3xl border border-dashed border-gray-200">
                                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No games found</h3>
                                <p className="text-sm text-gray-500 mb-6">We couldn't find any games matching your current filters.</p>
                                <Button onClick={() => setView('search')} variant="outline" className="rounded-xl px-8">
                                    Modify Search
                                </Button>
                            </div>
                        )}

                        {/* "If a game becomes FULL" - Integration hint */}
                        {filteredGames.some(g => g.joinedPlayersCount >= g.totalPlayersNeeded) && (
                            <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-500/20 animate-pulse-soft">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold">Ready to play?</h4>
                                        <p className="text-xs text-blue-100 italic">Game is full, book the venue now!</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl"
                                        onClick={() => navigate('/', { state: { sport: selectedSport, date: selectedDate?.toISOString(), city: selectedCity } })}
                                    >
                                        Book Venue
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {view === 'create' && (
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-lg font-bold">Create a Game Session</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Sport</label>
                                    <Select>
                                        <SelectTrigger className="w-full bg-gray-50 border-none rounded-xl h-12">
                                            <SelectValue placeholder="Select Sport" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sports.filter(s => s !== 'All Sports').map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Venue (Optional)</label>
                                    <Input className="bg-gray-50 border-none rounded-xl h-12" placeholder="e.g. PowerPlay Indiranagar" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Date</label>
                                        <Input type="date" className="bg-gray-50 border-none rounded-xl h-12" min={format(new Date(), 'yyyy-MM-dd')} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Time</label>
                                        <Input type="time" className="bg-gray-50 border-none rounded-xl h-12" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Total Players</label>
                                        <Input type="number" defaultValue="4" className="bg-gray-50 border-none rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Skill Level</label>
                                        <Select>
                                            <SelectTrigger className="w-full bg-gray-50 border-none rounded-xl h-12">
                                                <SelectValue placeholder="Skill" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 mt-4"
                                onClick={() => {
                                    toast.success("Game created successfully!");
                                    setView('results');
                                }}
                            >
                                Create Game
                            </Button>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Nav */}
            <PremiumBottomNav />
        </div>
    );
};

export default FindPlayer;
