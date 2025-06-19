import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewCard } from "@/components/review-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useApp } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Save, X, User, BookOpen, MessageSquare } from "lucide-react";

export default function Profile() {
  const { currentUser, setCurrentUser } = useApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(currentUser);

  const { data: userReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/reviews', { userId: currentUser?.id }],
    queryFn: () => currentUser ? api.getReviews({ userId: currentUser.id }) : Promise.resolve([]),
    enabled: !!currentUser,
  });

  const updateUserMutation = useMutation({
    mutationFn: (userData: Partial<typeof currentUser>) => 
      currentUser ? api.updateUser(currentUser.id, userData) : Promise.reject('No user'),
    onSuccess: (updatedUser) => {
      setCurrentUser(updatedUser);
      setIsEditing(false);
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUser?.id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!editedUser) return;
    
    updateUserMutation.mutate({
      name: editedUser.name,
      bio: editedUser.bio,
    });
  };

  const handleCancel = () => {
    setEditedUser(currentUser);
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
            <p className="text-gray-600">You need to be logged in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const reviewStats = userReviews ? {
    totalReviews: userReviews.length,
    averageRating: userReviews.length > 0 
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length 
      : 0,
    genres: [...new Set(userReviews.map(review => review.book.title))].length,
  } : { totalReviews: 0, averageRating: 0, genres: 0 };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editedUser?.name || ''}
                        onChange={(e) => setEditedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="text-lg font-semibold"
                        placeholder="Your name"
                      />
                      <Textarea
                        value={editedUser?.bio || ''}
                        onChange={(e) => setEditedUser(prev => prev ? { ...prev, bio: e.target.value } : null)}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl font-inter font-bold text-gray-900 mb-2">
                        {currentUser.name}
                      </h1>
                      <p className="text-gray-600 mb-1">@{currentUser.username}</p>
                      <p className="text-gray-600 mb-3">{currentUser.email}</p>
                      {currentUser.bio && (
                        <p className="text-gray-700">{currentUser.bio}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={updateUserMutation.isPending}
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    size="sm"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{reviewStats.totalReviews}</p>
                  <p className="text-sm text-gray-600">Reviews Written</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{reviewStats.genres}</p>
                  <p className="text-sm text-gray-600">Books Reviewed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">⭐</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : '0.0'}
                  </p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="activity">Reading Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>My Reviews ({reviewStats.totalReviews})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex space-x-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userReviews && userReviews.length > 0 ? (
                  <div className="space-y-6">
                    {userReviews.map((review, index) => (
                      <div key={review.id}>
                        <ReviewCard review={review} showBookTitle />
                        {index < userReviews.length - 1 && <Separator className="mt-6" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Start reviewing books to see them here!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Reading Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                  <p className="text-gray-600">Reading activity tracking will be available soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
