
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Calendar, Clock, AlertCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AuctionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    productId: id || "",
    productName: "Organic Wheat",
    startingPrice: "2200",
    reservePrice: "2500",
    minBidIncrement: "50",
    quantity: "20",
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
    description: "High-quality organic wheat grown without pesticides. Perfect for making premium flour and baking products.",
    auctionType: "standard",
    allowAutoBids: true,
    visibility: "public",
    shippingOptions: "seller",
    termsAccepted: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast({
        title: "Terms & Conditions",
        description: "You must accept the terms and conditions to create an auction.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate inputs
    if (parseInt(formData.startingPrice) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Starting price must be greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.endDate <= formData.startDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }
    
    // Submit form
    toast({
      title: isEditMode ? "Auction Updated" : "Auction Created",
      description: isEditMode 
        ? "Your auction has been successfully updated." 
        : "Your auction has been successfully created.",
    });
    
    navigate("/farmer-auctions");
  };

  return (
    <DashboardLayout userRole="farmer">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/farmer-auctions")} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Button>
        
        <DashboardHeader 
          title={isEditMode ? "Edit Auction" : "Create New Auction"} 
          userName="Rajesh Kumar" 
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auction Details</CardTitle>
                <CardDescription>Configure your auction settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="productName">Product</Label>
                    <Input 
                      id="productName" 
                      name="productName" 
                      value={formData.productName} 
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startingPrice">Starting Price (₹/Quintal)</Label>
                      <Input 
                        id="startingPrice" 
                        name="startingPrice" 
                        type="number" 
                        value={formData.startingPrice} 
                        onChange={handleInputChange}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reservePrice">Reserve Price (₹/Quintal)</Label>
                      <Input 
                        id="reservePrice" 
                        name="reservePrice" 
                        type="number" 
                        value={formData.reservePrice} 
                        onChange={handleInputChange}
                        min="1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Minimum price you're willing to accept</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minBidIncrement">Minimum Bid Increment (₹)</Label>
                      <Input 
                        id="minBidIncrement" 
                        name="minBidIncrement" 
                        type="number" 
                        value={formData.minBidIncrement} 
                        onChange={handleInputChange}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity (Quintals)</Label>
                      <Input 
                        id="quantity" 
                        name="quantity" 
                        type="number" 
                        value={formData.quantity} 
                        onChange={handleInputChange}
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Auction Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange}
                      className="min-h-28"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Auction Schedule</CardTitle>
                <CardDescription>Set when your auction starts and ends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Start Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <DatePicker
                        date={formData.startDate}
                        setDate={(date) => handleDateChange('startDate', date)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">End Date</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <DatePicker
                        date={formData.endDate}
                        setDate={(date) => handleDateChange('endDate', date)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Auction Duration</h4>
                      <p className="text-sm text-muted-foreground">
                        Your auction will run for {Math.round((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days, from {format(formData.startDate, "MMMM d, yyyy")} to {format(formData.endDate, "MMMM d, yyyy")}.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auction Settings</CardTitle>
                <CardDescription>Configure additional options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-2 block">Auction Type</Label>
                  <RadioGroup 
                    value={formData.auctionType} 
                    onValueChange={(value) => handleSelectChange('auctionType', value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-normal cursor-pointer">Standard Auction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dutch" id="dutch" />
                      <Label htmlFor="dutch" className="font-normal cursor-pointer">Dutch Auction (Decreasing Price)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sealed" id="sealed" />
                      <Label htmlFor="sealed" className="font-normal cursor-pointer">Sealed-Bid Auction</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="mb-2 block">Visibility</Label>
                  <Select 
                    value={formData.visibility} 
                    onValueChange={(value) => handleSelectChange('visibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public (Visible to all traders)</SelectItem>
                      <SelectItem value="private">Private (Invite-only)</SelectItem>
                      <SelectItem value="regional">Regional (Traders in your region)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="mb-2 block">Shipping Responsibility</Label>
                  <Select 
                    value={formData.shippingOptions} 
                    onValueChange={(value) => handleSelectChange('shippingOptions', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seller">I'll arrange shipping (seller's responsibility)</SelectItem>
                      <SelectItem value="buyer">Buyer arranges shipping (buyer's responsibility)</SelectItem>
                      <SelectItem value="negotiable">Negotiable after auction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowAutoBids" className="cursor-pointer">
                    Allow Auto-Bidding
                  </Label>
                  <Switch
                    id="allowAutoBids"
                    checked={formData.allowAutoBids}
                    onCheckedChange={(checked) => handleSwitchChange('allowAutoBids', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleSwitchChange('termsAccepted', checked)}
                  />
                  <Label htmlFor="termsAccepted" className="text-sm cursor-pointer">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> for hosting auctions on AgriTradeConnect
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full">
                  {isEditMode ? "Update Auction" : "Create Auction"}
                </Button>
                <Button variant="outline" type="button" className="w-full" onClick={() => navigate("/farmer-auctions")}>
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default AuctionForm;
