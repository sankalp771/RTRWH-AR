import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { MapPin, Home, Users, DollarSign, Calculator } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  roofArea: z.number().min(1, "Roof area must be greater than 0"),
  roofType: z.enum(["RCC", "GI", "Asbestos", "Tiles"], {
    required_error: "Please select a roof type"
  }),
  environment: z.enum(["Residential", "Industrial", "Agricultural"], {
    required_error: "Please select environment type"
  }),
  birdNesting: z.boolean().default(false),
  dwellers: z.number().min(1, "Number of dwellers must be at least 1"),
  purpose: z.enum(["Domestic", "Irrigation", "Industrial"], {
    required_error: "Please select purpose"
  }),
  hasOpenSpace: z.boolean().default(false),
  openSpaceArea: z.number().optional(),
  groundwaterDepth: z.number().min(0, "Groundwater depth must be positive"),
  soilType: z.enum(["Sandy", "Loamy", "Clayey"], {
    required_error: "Please select soil type"
  }),
  budget: z.enum(["Low", "Medium", "High"], {
    required_error: "Please select budget preference"
  })
});

type FormData = z.infer<typeof formSchema>;

interface UserInputFormProps {
  type: 'rainwater' | 'recharge';
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

export default function UserInputForm({ type, onSubmit, onBack }: UserInputFormProps) {
  const [hasOpenSpace, setHasOpenSpace] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      pincode: "",
      roofArea: 0,
      roofType: undefined,
      environment: undefined,
      birdNesting: false,
      dwellers: 4,
      purpose: undefined,
      hasOpenSpace: false,
      openSpaceArea: 0,
      groundwaterDepth: 0,
      soilType: undefined,
      budget: undefined
    }
  });

  const handleSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    onSubmit(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4" data-testid="button-back">
          ← Back to Selection
        </Button>
        <h1 className="text-3xl font-semibold mb-2">
          {type === 'rainwater' ? 'Rainwater Harvesting' : 'Artificial Recharge'} Calculator
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to get your personalized analysis and recommendations.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Personal & Location Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-medium">Personal & Location Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city name" {...field} data-testid="input-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN Code</FormLabel>
                    <FormControl>
                      <Input placeholder="6-digit PIN code" {...field} data-testid="input-pincode" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Roof Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Home className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-medium">Roof Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="roofArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roof Area (m²)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter roof area" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        data-testid="input-roof-area"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roofType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roof Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-roof-type">
                          <SelectValue placeholder="Select roof type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RCC">RCC (Reinforced Concrete)</SelectItem>
                        <SelectItem value="GI">GI (Galvanized Iron)</SelectItem>
                        <SelectItem value="Asbestos">Asbestos Sheets</SelectItem>
                        <SelectItem value="Tiles">Clay/Concrete Tiles</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Environment & Usage */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-medium">Environment & Usage</h3>
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="environment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surrounding Environment</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6"
                        data-testid="radio-environment"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Residential" id="residential" />
                          <Label htmlFor="residential">Residential</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Industrial" id="industrial" />
                          <Label htmlFor="industrial">Industrial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Agricultural" id="agricultural" />
                          <Label htmlFor="agricultural">Agricultural</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birdNesting"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-bird-nesting"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Bird Nesting Area</FormLabel>
                      <FormDescription>
                        Check if your roof area has bird nesting (affects water quality)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dwellers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Dwellers</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Number of people" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-dwellers"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Purpose</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-purpose">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Domestic">Domestic Use</SelectItem>
                          <SelectItem value="Irrigation">Irrigation</SelectItem>
                          <SelectItem value="Industrial">Industrial Use</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Site Conditions */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-medium">Site Conditions</h3>
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="hasOpenSpace"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setHasOpenSpace(checked as boolean);
                        }}
                        data-testid="checkbox-open-space"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Open Space Available</FormLabel>
                      <FormDescription>
                        Check if you have open space for recharge structures
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {hasOpenSpace && (
                <FormField
                  control={form.control}
                  name="openSpaceArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Open Space Area (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter open space area" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-open-space-area"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="groundwaterDepth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Groundwater Depth (m)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Depth in meters" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-groundwater-depth"
                        />
                      </FormControl>
                      <FormDescription>
                        Depth to water table from ground surface
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-soil-type">
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sandy">Sandy (High infiltration)</SelectItem>
                          <SelectItem value="Loamy">Loamy (Medium infiltration)</SelectItem>
                          <SelectItem value="Clayey">Clayey (Low infiltration)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Budget Preferences */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-medium">Budget Preferences</h3>
            </div>
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid md:grid-cols-3 gap-4"
                      data-testid="radio-budget"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-md hover-elevate">
                        <RadioGroupItem value="Low" id="budget-low" />
                        <Label htmlFor="budget-low" className="cursor-pointer">
                          <div>
                            <div className="font-medium">Low Budget</div>
                            <div className="text-sm text-muted-foreground">Basic solutions</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-md hover-elevate">
                        <RadioGroupItem value="Medium" id="budget-medium" />
                        <Label htmlFor="budget-medium" className="cursor-pointer">
                          <div>
                            <div className="font-medium">Medium Budget</div>
                            <div className="text-sm text-muted-foreground">Balanced approach</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-md hover-elevate">
                        <RadioGroupItem value="High" id="budget-high" />
                        <Label htmlFor="budget-high" className="cursor-pointer">
                          <div>
                            <div className="font-medium">High Budget</div>
                            <div className="text-sm text-muted-foreground">Premium solutions</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} size="lg" data-testid="button-back-bottom">
              Back
            </Button>
            <Button type="submit" size="lg" className="flex-1" data-testid="button-calculate">
              Calculate {type === 'rainwater' ? 'Rainwater Potential' : 'Recharge Capacity'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}