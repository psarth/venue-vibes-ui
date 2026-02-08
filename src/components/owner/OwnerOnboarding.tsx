
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, X, Upload, MapPin, DollarSign, Clock, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function OwnerOnboarding({ onComplete }: { onComplete: () => void }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        pricePerSlot: '',
        upiId: '',
        sports: [] as string[],
        slotDuration: '60',
        startTime: '06:00',
        endTime: '23:00',
        images: [] as string[]
    });

    const availableSports = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball'];

    const handleSportToggle = (sport: string) => {
        setFormData(prev => ({
            ...prev,
            sports: prev.sports.includes(sport)
                ? prev.sports.filter(s => s !== sport)
                : [...prev.sports, sport]
        }));
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, base64String]
                }));
                toast({
                    title: "Photo Added 📸",
                    description: "Your photo has been uploaded successfully."
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.sports.length === 0) {
            toast({ title: "Error", description: "Please select at least one sport", variant: "destructive" });
            setLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            // Save to localStorage for demo persistence
            const venueData = {
                ...formData,
                id: `venue-${Date.now()}`,
                status: 'active',
                rating: 0,
                reviews: 0
            };

            localStorage.setItem('owner_venue', JSON.stringify(venueData));

            toast({
                title: "Venue Live!",
                description: "Your venue is now live and ready for bookings."
            });

            setLoading(false);
            onComplete();
        }, 1500);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Your Venue</h1>
                <p className="text-gray-500">Enter your venue details to go live instantly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Venue Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Venue Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Super Kick Turf"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price per Slot (₹)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="e.g. 1200"
                                    className="pl-9"
                                    value={formData.pricePerSlot}
                                    onChange={e => setFormData({ ...formData, pricePerSlot: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <textarea
                                id="address"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                placeholder="Enter complete venue address"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <textarea
                            id="desc"
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell customers about your facilities, lighting, parking..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* Sports & Slots */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Sports & Timing</h3>

                    <div className="space-y-3">
                        <Label>Select Sports Offered</Label>
                        <div className="flex flex-wrap gap-3">
                            {availableSports.map(sport => (
                                <button
                                    key={sport}
                                    type="button"
                                    onClick={() => handleSportToggle(sport)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${formData.sports.includes(sport)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {sport}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Opening Time</Label>
                            <Input
                                type="time"
                                value={formData.startTime}
                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Closing Time</Label>
                            <Input
                                type="time"
                                value={formData.endTime}
                                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Slot Duration</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.slotDuration}
                                onChange={e => setFormData({ ...formData, slotDuration: e.target.value })}
                            >
                                <option value="30">30 Minutes</option>
                                <option value="60">60 Minutes</option>
                                <option value="90">90 Minutes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Payment */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Payout Details</h3>
                    <div className="space-y-2">
                        <Label htmlFor="upi">UPI ID (for receiving payments)</Label>
                        <Input
                            id="upi"
                            placeholder="e.g. mobile@upi"
                            value={formData.upiId}
                            onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                            required
                        />
                    </div>
                    {/* Photos */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">Venue Photos</h3>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={triggerFileInput}
                                className="text-primary border-primary/30 hover:bg-primary/5 h-9"
                            >
                                <Plus className="w-4 h-4 mr-1.5" />
                                Choose Photo
                            </Button>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAddImage}
                            accept="image/*"
                            className="hidden"
                        />

                        {formData.images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                                        <img src={img} alt="Venue" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="p-2.5 bg-white/20 hover:bg-red-500 text-white rounded-full transition-all scale-90 group-hover:scale-100 border border-white/30"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {/* Add more button */}
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                >
                                    <div className="p-2 bg-gray-50 rounded-full group-hover:bg-primary/10 transition-colors">
                                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={triggerFileInput}
                                className="w-full py-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                            >
                                <div className="p-4 bg-gray-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-base font-bold text-gray-900">Upload photos of your venue</p>
                                    <p className="text-sm text-gray-500">Add at least 3 high-quality photos to attract more customers</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Setting up Venue...
                        </>
                    ) : (
                        'Go Live Instantly'
                    )}
                </Button>
            </form>
        </div>
    );
}
